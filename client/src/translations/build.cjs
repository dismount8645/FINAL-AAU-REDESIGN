const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');
const dstDir = __dirname;

const daJsonPath = path.join(localesDir, 'da.json');
const enJsonPath = path.join(localesDir, 'en.json');

const da = JSON.parse(fs.readFileSync(daJsonPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

// --- Deep Key Comparison & Assertion ---
function getDeepKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const current = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getDeepKeys(value, current));
    } else {
      keys.push(current);
    }
  }
  return keys;
}

const daKeys = getDeepKeys(da);
const enKeys = getDeepKeys(en);

const missingInEn = daKeys.filter(k => !enKeys.includes(k));
const missingInDa = enKeys.filter(k => !daKeys.includes(k));

if (missingInEn.length > 0 || missingInDa.length > 0) {
  if (missingInEn.length > 0) {
    console.error('ERROR: Missing English translations for:', missingInEn);
  }
  if (missingInDa.length > 0) {
    console.error('ERROR: Missing Danish translations for:', missingInDa);
  }
  process.exit(1);
}

console.log('Success: Translation keys match perfectly.');

// --- Flat Map Alias Generator ---
function generateFlatMap(categories) {
  const flat = {};
  
  for (const [categoryKey, categoryValue] of Object.entries(categories)) {
    for (const [entryKey, entryValue] of Object.entries(categoryValue)) {
      if (typeof entryValue !== 'string') continue;
      flat[`${categoryKey}.${entryKey}`] = entryValue;
    }
  }
  
  for (const [categoryKey, categoryValue] of Object.entries(categories)) {
    const singularCategoryKey = categoryKey.endsWith('s') ? categoryKey.slice(0, -1) : categoryKey;
    
    for (const [entryKey, entryValue] of Object.entries(categoryValue)) {
      if (typeof entryValue !== 'string') continue;
      
      if (flat[entryKey] === undefined) {
        flat[entryKey] = entryValue;
      }
      
      const categoryAlias = `${categoryKey}_${entryKey}`;
      if (flat[categoryAlias] === undefined) {
        flat[categoryAlias] = entryValue;
      }
      
      const singularAlias = `${singularCategoryKey}_${entryKey}`;
      if (flat[singularAlias] === undefined) {
        flat[singularAlias] = entryValue;
      }
      
      if (categoryKey === 'categories') {
        const categoryItemAlias = `cat_${entryKey}`;
        if (flat[categoryItemAlias] === undefined) {
          flat[categoryItemAlias] = entryValue;
        }
      }
    }
  }
  
  if (flat.no_search_results === undefined && flat.search_no_results !== undefined) {
    flat.no_search_results = flat.search_no_results;
  }
  
  return flat;
}

const daFlat = generateFlatMap(da);
const enFlat = generateFlatMap(en);

// --- Recursively Build keys.ts path maps ---
function buildKeys(obj, pathStr = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = pathStr ? `${pathStr}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = buildKeys(value, currentPath);
    } else {
      result[key] = currentPath;
    }
  }
  return result;
}

const keysMap = buildKeys(da);

// --- Write Files ---
const keysContent = `export const keys = ${JSON.stringify(keysMap, null, 2)} as const;\n`;
fs.writeFileSync(path.join(dstDir, 'keys.ts'), keysContent, 'utf8');
console.log('Wrote keys.ts');

const daContent = `export const da = ${JSON.stringify(daFlat, null, 2)} as const;\n`;
fs.writeFileSync(path.join(dstDir, 'da.ts'), daContent, 'utf8');
console.log('Wrote da.ts');

const enContent = `export const en = ${JSON.stringify(enFlat, null, 2)} as const;\n`;
fs.writeFileSync(path.join(dstDir, 'en.ts'), enContent, 'utf8');
console.log('Wrote en.ts');
