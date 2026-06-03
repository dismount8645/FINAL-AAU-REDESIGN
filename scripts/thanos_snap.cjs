const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

function parseImport(importStr) {
  const normalized = importStr.replace(/\s+/g, ' ').trim();
  const isType = /^import\s+type\s+/.test(normalized);
  
  // Remove "type " from normalized to parse it normally
  const cleanStr = isType ? normalized.replace(/^import\s+type\s+/, 'import ') : normalized;
  
  const match = cleanStr.match(/import\s+(.*?)\s+from\s+['"]([^'"]+)['"]/);
  if (!match) {
    const bareMatch = cleanStr.match(/import\s+['"]([^'"]+)['"]/);
    if (bareMatch) {
      return {
        module: bareMatch[1],
        isBare: true,
        isType,
        original: importStr
      };
    }
    return null;
  }

  const body = match[1].trim();
  const module = match[2].trim();

  let defaultImport = null;
  let namespaceImport = null;
  const namedImports = [];

  const nsMatch = body.match(/\*\s+as\s+(\w+)/);
  if (nsMatch) {
    namespaceImport = nsMatch[1];
  }

  const namedMatch = body.match(/\{([\s\S]*?)\}/);
  if (namedMatch) {
    const parts = namedMatch[1].split(',');
    parts.forEach(p => {
      const name = p.trim();
      if (name) {
        namedImports.push(name);
      }
    });
  }

  let defaultPart = body;
  if (namedMatch) {
    defaultPart = body.replace(/\{[\s\S]*?\}/, '').replace(/,\s*$/, '').trim();
  } else if (nsMatch) {
    defaultPart = body.replace(/\*\s+as\s+\w+/, '').replace(/,\s*$/, '').trim();
  }
  
  if (defaultPart && defaultPart !== ',' && !defaultPart.includes('* as')) {
    defaultImport = defaultPart.replace(/,\s*$/, '').trim();
  }

  return {
    module,
    defaultImport,
    namespaceImport,
    namedImports,
    isBare: false,
    isType,
    original: importStr
  };
}

function formatImport(parsed) {
  if (parsed.isBare) {
    return `import ${parsed.isType ? 'type ' : ''}'${parsed.module}';`;
  }
  const parts = [];
  if (parsed.defaultImport) {
    parts.push(parsed.defaultImport);
  }
  if (parsed.namespaceImport) {
    parts.push(`* as ${parsed.namespaceImport}`);
  }
  if (parsed.namedImports.length > 0) {
    parts.push(`{ ${parsed.namedImports.join(', ')} }`);
  }
  
  let body = '';
  if (parsed.defaultImport && (parsed.namespaceImport || parsed.namedImports.length > 0)) {
    body = `${parsed.defaultImport}, ${parsed.namespaceImport || `{ ${parsed.namedImports.join(', ')} }`}`;
  } else {
    body = parts.join(', ');
  }
  return `import ${parsed.isType ? 'type ' : ''}${body} from '${parsed.module}';`;
}

function isSelfImport(importPath, implFilePath, implFileName) {
  const nameWithoutExt = implFileName.replace(/\.tsx?$/, '');
  const normPath = importPath.replace(/\\/g, '/');
  
  // 1. Relative self-imports
  if (normPath === '.' || normPath === './' || normPath === './index' || normPath === './index.ts' || normPath === './index.tsx') {
    if (nameWithoutExt === 'index') return true;
  }
  if (normPath === `./${nameWithoutExt}` || normPath === `./${implFileName}` || normPath === `./${nameWithoutExt}.ts` || normPath === `./${nameWithoutExt}.tsx` || normPath === `./${nameWithoutExt}.js` || normPath === `./${nameWithoutExt}.jsx`) {
    return true;
  }

  // 2. Alias self-imports
  const srcDir = path.resolve(__dirname, '../src');
  const relativeToSrc = path.relative(srcDir, implFilePath).replace(/\\/g, '/');
  const relWithoutExt = relativeToSrc.replace(/\.tsx?$/, '');
  
  if (normPath === `@/${relWithoutExt}` || normPath === `@/${relativeToSrc}`) {
    return true;
  }

  return false;
}

function extractImportsAndCode(content) {
  const importRegex = /import\s+(?:[\s\S]*?\s+from\s+)?['"][^'"]+['"];?/g;
  const imports = [];
  let code = content;
  
  let match;
  const matches = [];
  while ((match = importRegex.exec(content)) !== null) {
    matches.push({
      start: match.index,
      end: importRegex.lastIndex,
      text: match[0]
    });
  }
  
  // Cut out imports from code from back to front
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    code = code.slice(0, m.start) + code.slice(m.end);
    imports.push(m.text);
  }
  
  imports.reverse();
  return {
    imports,
    code: code.trim()
  };
}

function mergeImports(implImports, testImports, implFilePath, implFileName) {
  const mergedMap = new Map();
  const addParsed = (parsed) => {
    if (!parsed) return;
    const key = `${parsed.isType ? 'type:' : 'normal:'}${parsed.module}`;
    if (!mergedMap.has(key)) {
      mergedMap.set(key, {
        module: parsed.module,
        defaultImport: parsed.defaultImport,
        namespaceImport: parsed.namespaceImport,
        namedImports: [...parsed.namedImports],
        isBare: parsed.isBare,
        isType: parsed.isType
      });
    } else {
      const existing = mergedMap.get(key);
      if (parsed.defaultImport && !existing.defaultImport) {
        existing.defaultImport = parsed.defaultImport;
      }
      if (parsed.namespaceImport && !existing.namespaceImport) {
        existing.namespaceImport = parsed.namespaceImport;
      }
      parsed.namedImports.forEach(name => {
        if (!existing.namedImports.includes(name)) {
          existing.namedImports.push(name);
        }
      });
    }
  };

  implImports.forEach(imp => addParsed(parseImport(imp)));
  
  testImports.forEach(imp => {
    const parsed = parseImport(imp);
    if (parsed) {
      if (isSelfImport(parsed.module, implFilePath, implFileName)) {
        // Skip self-imports
        return;
      }
      addParsed(parsed);
    }
  });

  const merged = Array.from(mergedMap.values());

  // Sort imports
  merged.sort((a, b) => {
    const aMod = a.module;
    const bMod = b.module;
    
    // React first
    if (aMod === 'react' && bMod !== 'react') return -1;
    if (bMod === 'react' && aMod !== 'react') return 1;
    
    // vitest next
    if (aMod === 'vitest' && bMod !== 'vitest') return -1;
    if (bMod === 'vitest' && aMod !== 'vitest') return 1;

    // Node libraries and modules without relative path next
    const aIsRelative = aMod.startsWith('.') || aMod.startsWith('@/');
    const bIsRelative = bMod.startsWith('.') || bMod.startsWith('@/');
    
    if (!aIsRelative && bIsRelative) return -1;
    if (aIsRelative && !bIsRelative) return 1;
    
    return aMod.localeCompare(bMod);
  });

  // Separate namespace imports and named/default imports to prevent syntax errors
  const finalImports = [];
  merged.forEach(item => {
    if (item.namespaceImport && (item.defaultImport || item.namedImports.length > 0)) {
      // Split into two imports
      const nsItem = { ...item, defaultImport: null, namedImports: [] };
      const otherItem = { ...item, namespaceImport: null };
      finalImports.push(formatImport(nsItem));
      finalImports.push(formatImport(otherItem));
    } else {
      finalImports.push(formatImport(item));
    }
  });

  return finalImports;
}

// Special overrides map
const overrides = {
  'CourseTabs.test.tsx': 'CourseTabContent.tsx',
  'SettingsTabs.test.tsx': 'ProfileTab.tsx',
  'SupportSections.test.tsx': 'SupportSidebar.tsx',
  'useCalendar.test.tsx': 'useCalendar.ts',
  'validation.test.ts': 'course.ts'
};

const testFiles = walk(path.join(__dirname, '../src'));

console.log(`Found ${testFiles.length} test files to migrate.`);

testFiles.forEach(testFile => {
  const testFileName = path.basename(testFile);
  let implFile = null;
  
  if (overrides[testFileName]) {
    implFile = path.join(path.dirname(testFile), overrides[testFileName]);
  } else {
    if (testFile.endsWith('.test.tsx')) {
      implFile = testFile.replace('.test.tsx', '.tsx');
    } else if (testFile.endsWith('.test.ts')) {
      implFile = testFile.replace('.test.ts', '.ts');
    }
  }
  
  if (!implFile || !fs.existsSync(implFile)) {
    console.warn(`No implementation file found for ${testFile}, skipping.`);
    return;
  }

  // Rename implementation from .ts to .tsx if test ends in .tsx to support JSX
  if (testFile.endsWith('.test.tsx') && implFile.endsWith('.ts')) {
    const newImplFile = implFile.replace(/\.ts$/, '.tsx');
    console.log(`Renaming implementation file from ${implFile} to ${newImplFile} to support JSX`);
    try {
      execSync(`git mv "${implFile}" "${newImplFile}"`, { stdio: 'inherit' });
    } catch (e) {
      fs.renameSync(implFile, newImplFile);
    }
    implFile = newImplFile;
  }

  const implFileName = path.basename(implFile);
  console.log(`Migrating: ${testFileName} -> ${implFileName}`);
  
  const testContent = fs.readFileSync(testFile, 'utf8');
  const implContent = fs.readFileSync(implFile, 'utf8');
  
  const testParts = extractImportsAndCode(testContent);
  const implParts = extractImportsAndCode(implContent);
  
  const newImports = mergeImports(implParts.imports, testParts.imports, implFile, implFileName);
  
  // Format implementation content
  let newContent = '';
  if (newImports.length > 0) {
    newContent += newImports.join('\n') + '\n\n';
  }
  
  newContent += implParts.code + '\n\n';
  
  newContent += `if (import.meta.vitest) {\n`;
  newContent += `  // In-source testing\n`;
  
  // Indent test code by 2 spaces to look clean
  const indentedTestCode = testParts.code
    .split('\n')
    .map(line => line ? '  ' + line : '')
    .join('\n');
    
  newContent += indentedTestCode + '\n';
  newContent += `}\n`;
  
  fs.writeFileSync(implFile, newContent, 'utf8');
  
  // Delete the test file via git rm
  try {
    execSync(`git rm -f "${testFile}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Failed to git rm ${testFile}, deleting manually.`);
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  }
});

console.log('Thanos snap test migration complete!');
