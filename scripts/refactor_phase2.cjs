const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const componentsDir = path.join(srcDir, 'components');
const pagesDir = path.join(srcDir, 'pages');

const foldersToFlatten = [
  'components/ui',
  'components/layout',
  'components/common',
  'widgets',
  'pages/course',
  'pages/courses',
  'pages/dashboard',
  'pages/favorites',
  'pages/forumPost',
  'pages/grades',
  'pages/messages',
  'pages/notifications',
  'pages/resources',
  'pages/searchResults',
  'pages/settings',
  'pages/submission',
  'pages/support',
  'features/calendar/components',
  'features/calendar/api',
  'features/calendar/hooks'
];

// Ensure src/components/ exists
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

// 1. Move Calendar page files
const calendarSrc = path.join(srcDir, 'features/calendar/Calendar.tsx');
const calendarTestSrc = path.join(srcDir, 'features/calendar/Calendar.test.tsx');
if (fs.existsSync(calendarSrc)) {
  console.log(`Moving Calendar.tsx to pages/`);
  fs.renameSync(calendarSrc, path.join(pagesDir, 'Calendar.tsx'));
}
if (fs.existsSync(calendarTestSrc)) {
  console.log(`Moving Calendar.test.tsx to pages/`);
  fs.renameSync(calendarTestSrc, path.join(pagesDir, 'Calendar.test.tsx'));
}

let fileMoveMap = {};
let fileNamesSeen = {};
let origFolderOfFile = {}; // tracks original subfolder to help with relative imports

foldersToFlatten.forEach(folder => {
  const folderPath = path.join(srcDir, folder);
  if (!fs.existsSync(folderPath)) return;
  
  function scan(dir) {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scan(fullPath);
      } else {
        if (file === 'index.ts') return;
        
        const ext = path.extname(file);
        const base = path.basename(file, ext);
        const parent = path.basename(dir);
        
        let newFileName = file;
        if (file === 'types.ts' || file === 'types.d.ts') {
          // Rename types.ts based on parent folder
          newFileName = `${parent}Types${ext}`;
        } else if (file === 'constants.ts' && dir.includes('calendar')) {
          newFileName = `calendarConstants${ext}`;
        }
        
        if (fileNamesSeen[newFileName] && fileNamesSeen[newFileName] !== dir) {
          newFileName = `${parent}_${newFileName}`;
        }
        fileNamesSeen[newFileName] = dir;
        origFolderOfFile[newFileName] = folder; // remember original folder (e.g. 'pages/grades')
        
        fileMoveMap[fullPath] = path.join(componentsDir, newFileName);
      }
    });
  }
  scan(folderPath);
});

// Consolidate index.ts exports before deleting files
let consolidatedExports = [];
const indexFiles = [
  'src/components/ui/index.ts',
  'src/widgets/index.ts',
  'src/pages/course/index.ts',
  'src/pages/courses/index.ts',
  'src/pages/dashboard/index.ts',
  'src/pages/favorites/index.ts',
  'src/pages/forumPost/index.ts',
  'src/pages/grades/index.ts',
  'src/pages/messages/index.ts',
  'src/pages/notifications/index.ts',
  'src/pages/resources/index.ts',
  'src/pages/searchResults/index.ts',
  'src/pages/settings/index.ts',
  'src/pages/submission/index.ts',
  'src/pages/support/index.ts',
  'src/features/calendar/components/index.ts'
];

indexFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) return;
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach(line => {
    if (!line.trim() || line.startsWith('//')) return;
    
    const match = line.match(/from\s+['"]\.\/([^'"]+)['"]/);
    if (match) {
      let subPath = match[1];
      if (file.includes('grades') && subPath === 'types') {
        subPath = 'gradesTypes';
      } else if (file.includes('messages') && subPath === 'types') {
        subPath = 'messagesTypes';
      } else if (file.includes('notifications') && subPath === 'types') {
        subPath = 'notificationsTypes';
      } else if (file.includes('submission') && subPath === 'types') {
        subPath = 'submissionTypes';
      } else if (file.includes('calendar') && subPath === 'constants') {
        subPath = 'calendarConstants';
      }
      
      const newLine = line.replace(/from\s+['"]\.\/[^'"]+['"]/, `from './${subPath}'`);
      consolidatedExports.push(newLine);
    } else {
      consolidatedExports.push(line);
    }
  });
});

// Move components and pages files
for (const [oldPath, newPath] of Object.entries(fileMoveMap)) {
  console.log(`Moving component: ${oldPath} -> ${newPath}`);
  fs.renameSync(oldPath, newPath);
}

// Write the new consolidated index
fs.writeFileSync(path.join(componentsDir, 'index.ts'), consolidatedExports.join('\n'), 'utf8');
console.log('Created consolidated src/components/index.ts');

// Delete now empty folders and their index files
foldersToFlatten.forEach(folder => {
  const folderPath = path.join(srcDir, folder);
  if (!fs.existsSync(folderPath)) return;
  
  const files = fs.readdirSync(folderPath);
  files.forEach(f => {
    fs.unlinkSync(path.join(folderPath, f));
  });
  
  fs.rmdirSync(folderPath);
  console.log(`Deleted empty folder: ${folderPath}`);
});

// Cleanup empty parent dirs
const parentDirsToDelete = [
  path.join(srcDir, 'features/calendar'),
  path.join(srcDir, 'features'),
  path.join(srcDir, 'widgets')
];
parentDirsToDelete.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    if (files.length === 0) {
      fs.rmdirSync(dir);
      console.log(`Deleted empty parent folder: ${dir}`);
    }
  }
});

// Clean empty sub-folders inside pages/
const pagesSubfolders = [
  'course', 'courses', 'dashboard', 'favorites', 'forumPost',
  'grades', 'messages', 'notifications', 'resources', 'searchResults',
  'settings', 'submission', 'support'
];
pagesSubfolders.forEach(sub => {
  const p = path.join(pagesDir, sub);
  if (fs.existsSync(p)) {
    const files = fs.readdirSync(p);
    files.forEach(f => fs.unlinkSync(path.join(p, f)));
    fs.rmdirSync(p);
    console.log(`Deleted empty pages subfolder: ${p}`);
  }
});

// Global find and replace across src/ and e2e/
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

const foldersToScan = [srcDir, path.join(__dirname, '../e2e')];

foldersToScan.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  walkDir(dir, filePath => {
    const ext = path.extname(filePath);
    if (!['.ts', '.tsx', '.json', '.js'].includes(ext)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // 1. Rename specific type & constant imports first
    content = content.replace(/@\/pages\/grades\/types/g, '@/components/gradesTypes');
    content = content.replace(/@\/pages\/messages\/types/g, '@/components/messagesTypes');
    content = content.replace(/@\/pages\/notifications\/types/g, '@/components/notificationsTypes');
    content = content.replace(/@\/pages\/submission\/types/g, '@/components/submissionTypes');
    content = content.replace(/@\/features\/calendar\/components\/constants/g, '@/components/calendarConstants');
    
    // 2. Calendar route mapping
    content = content.replace(/@\/features\/calendar\/Calendar/g, '@/pages/Calendar');
    content = content.replace(/@\/features\/calendar\/hooks\/useCalendar/g, '@/components/useCalendar');
    content = content.replace(/@\/features\/calendar\/api\/calendar/g, '@/components/calendar');
    content = content.replace(/@\/features\/calendar\/components\//g, '@/components/');
    content = content.replace(/@\/features\/calendar\//g, '@/components/');

    // 3. Components flattening
    content = content.replace(/@\/components\/ui\//g, '@/components/');
    content = content.replace(/@\/components\/layout\//g, '@/components/');
    content = content.replace(/@\/components\/common\//g, '@/components/');
    
    // 4. Widgets & Pages mapping
    content = content.replace(/@\/widgets\//g, '@/components/');
    content = content.replace(/@\/widgets/g, '@/components');
    
    pagesSubfolders.forEach(sub => {
      content = content.replace(new RegExp(`@/pages/${sub}/`, 'g'), '@/components/');
    });

    // 5. Update relative imports inside the moved files
    const filename = path.basename(filePath);
    const origFolder = origFolderOfFile[filename];
    if (origFolder) {
      if (origFolder.includes('grades')) {
        content = content.replace(/from\s+['"]\.\/types['"]/g, `from './gradesTypes'`);
      } else if (origFolder.includes('messages')) {
        content = content.replace(/from\s+['"]\.\/types['"]/g, `from './messagesTypes'`);
      } else if (origFolder.includes('notifications')) {
        content = content.replace(/from\s+['"]\.\/types['"]/g, `from './notificationsTypes'`);
      } else if (origFolder.includes('submission')) {
        content = content.replace(/from\s+['"]\.\/types['"]/g, `from './submissionTypes'`);
      } else if (origFolder.includes('calendar') && filename.includes('View')) {
        content = content.replace(/from\s+['"]\.\/constants['"]/g, `from './calendarConstants'`);
      }
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated imports in ${filePath}`);
    }
  });
});

console.log('Refactoring Phase 2 done!');
