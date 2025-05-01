const fs = require('fs');
const path = require('path');
const html2pug = require('html2pug');

const inputDir = './html-files'; // Root directory to scan

function walkAndConvert(currentDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      walkAndConvert(fullPath); // Recurse into subdirectory
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.html') {
      const fileName = path.basename(entry.name, '.html');
      const pugPath = path.join(currentDir, `${fileName}.pug`);

      try {
        const html = fs.readFileSync(fullPath, 'utf8');
        const pug = html2pug(html, { tabs: true });

        fs.writeFileSync(pugPath, pug, 'utf8');
        fs.unlinkSync(fullPath); // Delete original HTML file

        console.log(`✓ Converted and deleted: ${fullPath}`);
      } catch (err) {
        console.error(`✗ Error processing ${fullPath}:`, err.message);
      }
    }
  }
}

walkAndConvert(inputDir);
