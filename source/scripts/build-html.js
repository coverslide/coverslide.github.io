const fs = require('node:fs');
const path = require('node:path');
const pug = require('pug');

const root = path.resolve(__dirname, '..');
const outputDirectory = path.join(root, 'build');
const template = path.join(root, 'views', 'index.pug');

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(
  path.join(outputDirectory, 'index.html'),
  pug.renderFile(template)
);
