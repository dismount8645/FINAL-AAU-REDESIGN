const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const pagesDir = path.join(srcDir, 'pages');

const pageFiles = fs.readdirSync(pagesDir);

pageFiles.forEach(file => {
  const filePath = path.join(pagesDir, file);
  if (fs.statSync(filePath).isDirectory() || !file.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Replace relative imports to old subfolders with '@/components'
  // Match: import ... from './course/index' or './course'
  // Also match: import { useCalendar } from './hooks/useCalendar' inside Calendar.tsx -> '@/components/useCalendar'
  if (file === 'Calendar.tsx') {
    content = content.replace(/from\s+['"]\.\/hooks\/useCalendar['"]/g, `from '@/components/useCalendar'`);
    content = content.replace(/from\s+['"]\.\/components\/index['"]/g, `from '@/components'`);
    content = content.replace(/from\s+['"]\.\/components['"]/g, `from '@/components'`);
  }
  
  // Replace any page subfolder imports like ./course/index or ./course or ./dashboard/index
  content = content.replace(/from\s+['"]\.\/([a-zA-Z0-9]+)(\/index)?['"]/g, `from '@/components'`);
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed page imports in ${file}`);
  }
});

console.log('Page imports fix complete!');
