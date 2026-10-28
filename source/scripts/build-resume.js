const fs = require('node:fs');
const path = require('node:path');
const pug = require('pug');

const root = path.resolve(__dirname, '..');
const template = path.join(root, 'views', 'resume.pug');
const outputPath = path.resolve(root, '..', 'resume.html');

fs.writeFileSync(outputPath, pug.renderFile(template, { pretty: true }));
console.log(`Wrote ${outputPath}`);