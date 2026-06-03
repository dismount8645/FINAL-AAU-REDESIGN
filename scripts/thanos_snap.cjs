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
  const cleanStr = isType ? normalized.replace(/^import\s+type\s+/, 'import ') : normalized;
  const match = cleanStr.match(/import\s+(.*?)\s+from\s+['"]([^'"]+)['"]/);
  if (!match) {
    const bareMatch = cleanStr.match(/import\s+['"]([^'"]+)['"]/);
    if (bareMatch) return { module: bareMatch[1], isBare: true, isType, original: importStr };
    return null;
  }
  const body = match[1].trim();
  const module = match[2].trim();
  let defaultImport = null, namespaceImport = null, namedImports = [];
  const nsMatch = body.match(/\*\s+as\s+(\w+)/);
  if (nsMatch) namespaceImport = nsMatch[1];
  const namedMatch = body.match(/\{([\s\S]*?)\}/);
  if (namedMatch) {
    namedMatch[1].split(',').forEach(p => { const n = p.trim(); if (n) namedImports.push(n); });
  }
  let defaultPart = body;
  if (namedMatch) defaultPart = body.replace(/\{[\s\S]*?\}/, '').replace(/,\s*$/, '').trim();
  else if (nsMatch) defaultPart = body.replace(/\*\s+as\s+\w+/, '').replace(/,\s*$/, '').trim();
  if (defaultPart && defaultPart !== ',' && !defaultPart.includes('* as')) defaultImport = defaultPart.replace(/,\s*$/, '').trim();
  return { module, defaultImport, namespaceImport, namedImports, isBare: false, isType, original: importStr };
}

function formatImport(parsed) {
  if (parsed.isBare) return `import ${parsed.isType ? 'type ' : ''}'${parsed.module}';`;
  const parts = [];
  if (parsed.defaultImport) parts.push(parsed.defaultImport);
  if (parsed.namespaceImport) parts.push(`* as ${parsed.namespaceImport}`);
  if (parsed.namedImports.length > 0) parts.push(`{ ${parsed.namedImports.join(', ')} }`);
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
  if (normPath === '.' || normPath === './' || normPath === './index' || normPath === './index.ts' || normPath === './index.tsx') {
    if (nameWithoutExt === 'index') return true;
  }
  if (normPath === `./${nameWithoutExt}` || normPath === `./${implFileName}` || normPath === `./${nameWithoutExt}.ts` || normPath === `./${nameWithoutExt}.tsx` || normPath === `./${nameWithoutExt}.js` || normPath === `./${nameWithoutExt}.jsx`) return true;
  const srcDir = path.resolve(__dirname, '../src');
  const relativeToSrc = path.relative(srcDir, implFilePath).replace(/\\/g, '/');
  const relWithoutExt = relativeToSrc.replace(/\.tsx?$/, '');
  if (normPath === `@/${relWithoutExt}` || normPath === `@/${relativeToSrc}`) return true;
  return false;
}

/** Extract imports from file content (including multi-line) */
function extractImports(content) {
  const importRegex = /import\s+(?:[\s\S]*?\s+from\s+)?['"][^'"]+['"]\s*;?/g;
  const imports = [];
  let code = content;
  let match;
  const matches = [];
  while ((match = importRegex.exec(content)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
  }
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    code = code.slice(0, m.start) + code.slice(m.end);
    imports.push(m.text);
  }
  imports.reverse();
  return { imports, code: code.trim() };
}

/** Parse test file into imports, module-level setup (vi.mock + vars), and test code */
function parseTestFile(content) {
  const { imports, code: rest } = extractImports(content);
  
  // Find first describe/it/test — everything before is setup
  const testStart = /^\s*(describe|it\s*\(|test\s*\()/m;
  const match = rest.match(testStart);
  
  let setup = '', testCode = '';
  if (match) {
    setup = rest.slice(0, match.index).trim();
    testCode = rest.slice(match.index).trim();
  } else {
    setup = rest.trim();
  }
  
  return { imports, setup, testCode };
}

function mergeImports(implImports, testImports, implFilePath, implFileName) {
  const mergedMap = new Map();
  const addParsed = (parsed) => {
    if (!parsed) return;
    const key = `${parsed.isType ? 'type:' : 'normal:'}${parsed.module}`;
    if (!mergedMap.has(key)) {
      mergedMap.set(key, { module: parsed.module, defaultImport: parsed.defaultImport, namespaceImport: parsed.namespaceImport, namedImports: [...parsed.namedImports], isBare: parsed.isBare, isType: parsed.isType });
    } else {
      const existing = mergedMap.get(key);
      if (parsed.defaultImport && !existing.defaultImport) existing.defaultImport = parsed.defaultImport;
      if (parsed.namespaceImport && !existing.namespaceImport) existing.namespaceImport = parsed.namespaceImport;
      parsed.namedImports.forEach(name => { if (!existing.namedImports.includes(name)) existing.namedImports.push(name); });
    }
  };
  implImports.forEach(imp => addParsed(parseImport(imp)));
  testImports.forEach(imp => {
    const parsed = parseImport(imp);
    if (parsed) {
      if (isSelfImport(parsed.module, implFilePath, implFileName)) return;
      addParsed(parsed);
    }
  });
  const merged = Array.from(mergedMap.values());
  merged.sort((a, b) => {
    const aMod = a.module, bMod = b.module;
    if (aMod === 'react' && bMod !== 'react') return -1;
    if (bMod === 'react' && aMod !== 'react') return 1;
    if (aMod === 'vitest' && bMod !== 'vitest') return -1;
    if (bMod === 'vitest' && aMod !== 'vitest') return 1;
    const aRel = aMod.startsWith('.') || aMod.startsWith('@/');
    const bRel = bMod.startsWith('.') || bMod.startsWith('@/');
    if (!aRel && bRel) return -1;
    if (aRel && !bRel) return 1;
    return aMod.localeCompare(bMod);
  });
  const finalImports = [];
  merged.forEach(item => {
    if (item.namespaceImport && (item.defaultImport || item.namedImports.length > 0)) {
      finalImports.push(formatImport({ ...item, defaultImport: null, namedImports: [] }));
      finalImports.push(formatImport({ ...item, namespaceImport: null }));
    } else {
      finalImports.push(formatImport(item));
    }
  });
  return finalImports;
}

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
    if (testFile.endsWith('.test.tsx')) implFile = testFile.replace('.test.tsx', '.tsx');
    else if (testFile.endsWith('.test.ts')) implFile = testFile.replace('.test.ts', '.ts');
  }

  if (!implFile || !fs.existsSync(implFile)) {
    console.warn(`\x1b[31;1mNo implementation file found for ${testFile}, skipping.\x1b[0m`);
    return;
  }

  if (testFile.endsWith('.test.tsx') && implFile.endsWith('.ts')) {
    const newImplFile = implFile.replace(/\.ts$/, '.tsx');
    console.log(`Renaming implementation file from ${implFile} to ${newImplFile} to support JSX`);
    try { execSync(`git mv "${implFile}" "${newImplFile}"`, { stdio: 'inherit' }); }
    catch (e) { fs.renameSync(implFile, newImplFile); }
    implFile = newImplFile;
  }

  const implFileName = path.basename(implFile);
  console.log(`Migrating: ${testFileName} -> ${implFileName}`);

  const testContent = fs.readFileSync(testFile, 'utf8');
  const implContent = fs.readFileSync(implFile, 'utf8');

  const testParts = parseTestFile(testContent);
  const implParts = extractImports(implContent);

  const newImports = mergeImports(implParts.imports, testParts.imports, implFile, implFileName);

  let newContent = '';
  if (newImports.length > 0) {
    newContent += newImports.join('\n') + '\n\n';
  }

  newContent += implParts.code + '\n';

  if (testParts.setup) {
    newContent += '\n' + testParts.setup + '\n';
  }

  if (testParts.testCode) {
    newContent += '\nif (import.meta.vitest) {\n';
    const indented = testParts.testCode.split('\n').map(l => l ? '  ' + l : '').join('\n');
    newContent += indented + '\n}\n';
  }

  fs.writeFileSync(implFile, newContent, 'utf8');

  try { execSync(`git rm -f "${testFile}"`, { stdio: 'inherit' }); }
  catch (err) {
    console.error(`Failed to git rm ${testFile}, deleting manually.`);
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
  }
});

console.log('Thanos snap test migration complete!');
