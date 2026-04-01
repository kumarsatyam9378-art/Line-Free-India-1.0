const fs = require('fs');

const content = fs.readFileSync('src/index.css', 'utf8');
const lines = content.split('\n');

const fontImport = lines.find(l => l.includes('@import url'));
const cleanLines = lines.filter(l => !l.includes('@import url'));

cleanLines.unshift(fontImport);

fs.writeFileSync('src/index.css', cleanLines.join('\n'));
console.log('Fixed CSS order.');
