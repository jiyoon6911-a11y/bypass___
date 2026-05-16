const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/mint/g, 'cyan-400');
      content = content.replace(/purple/g, 'blue');
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}
processDir('./src');
console.log('Replaced successfully');
