const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const libDir = path.join(srcDir, 'lib');

// Ensure src/lib/ exists
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
}

const foldersToMove = ['constants', 'config', 'data', 'utils', 'hooks'];

// Move files
foldersToMove.forEach(folder => {
  const folderPath = path.join(srcDir, folder);
  if (!fs.existsSync(folderPath)) return;
  
  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
    if (file === 'index.ts') {
      return;
    }
    const oldFilePath = path.join(folderPath, file);
    const newFilePath = path.join(libDir, file);
    
    console.log(`Moving ${oldFilePath} to ${newFilePath}`);
    fs.renameSync(oldFilePath, newFilePath);
  });
  
  // Delete the old folder
  const remainingFiles = fs.readdirSync(folderPath);
  remainingFiles.forEach(file => {
    fs.unlinkSync(path.join(folderPath, file));
  });
  fs.rmdirSync(folderPath);
  console.log(`Deleted folder ${folderPath}`);
});

// Create src/lib/index.ts
const indexContent = `export { ASSETS } from '@/lib/assets'
export const API_RETRY_BACKOFF = [500, 1500, 3000]
export { useCalendar } from '@/features/calendar/hooks/useCalendar'
export { useWidgetDrag } from '@/lib/useWidgetDrag'
export { useCoursesFilterAndSort } from '@/lib/useCoursesFilterAndSort'
export { useMessagesState } from '@/lib/useMessagesState'
export { useSettingsState } from '@/lib/useSettingsState'
export { useSearch } from '@/lib/useSearch'
export { useDropdown } from '@/lib/useDropdown'
`;

fs.writeFileSync(path.join(libDir, 'index.ts'), indexContent);
console.log('Created src/lib/index.ts');

// Run a global find-and-replace
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const foldersToScan = [path.join(__dirname, '../src'), path.join(__dirname, '../e2e')];

foldersToScan.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  walkDir(dir, filePath => {
    const ext = path.extname(filePath);
    if (!['.ts', '.tsx', '.json', '.js'].includes(ext)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    content = content.replace(/@\/utils\//g, '@/lib/');
    content = content.replace(/@\/hooks\//g, '@/lib/');
    content = content.replace(/@\/config\//g, '@/lib/');
    content = content.replace(/@\/data\//g, '@/lib/');
    content = content.replace(/@\/constants\//g, '@/lib/');
    
    content = content.replace(/@\/utils(["';])/g, '@/lib$1');
    content = content.replace(/@\/hooks(["';])/g, '@/lib$1');
    content = content.replace(/@\/config(["';])/g, '@/lib$1');
    content = content.replace(/@\/data(["';])/g, '@/lib$1');
    content = content.replace(/@\/constants(["';])/g, '@/lib$1');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated imports in ${filePath}`);
    }
  });
});

console.log('Refactoring Phase 1 done!');
