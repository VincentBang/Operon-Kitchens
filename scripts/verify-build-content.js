const fs = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();
const buildPagesDir = path.join(projectRoot, '.next', 'server', 'pages');
const staticExportDir = path.join(projectRoot, 'out');
const sourceDirs = [
  path.join(projectRoot, 'src', 'pages'),
  path.join(projectRoot, 'src', 'components'),
];

const requiredCopy = [
  'Sydney kitchen renovation estimates and quote review before you commit.',
  'Need help with scope? Ask Operon',
  'Operon Kitchens is a separate customer-facing kitchen renovation brand. Planning guidance only. Site measure and written scope confirmation are required before contract pricing.',
  'Planning range preview',
  'Sample review result',
];

const forbiddenCopy = [
  'Clear kitchen renovation estimates before you book a site visit',
  'Need help with scope??Ask Operon',
  'brand.Planning',
  'scope??Ask',
];

function collectTextFiles(targetPath) {
  if (!fs.existsSync(targetPath)) return [];
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) return [targetPath];

  return fs.readdirSync(targetPath).flatMap((entry) => {
    const nextPath = path.join(targetPath, entry);
    const nextStat = fs.statSync(nextPath);
    if (nextStat.isDirectory()) return collectTextFiles(nextPath);
    if (/\.(html|js|json|tsx|ts)$/.test(entry)) return [nextPath];
    return [];
  });
}

function readCombined(files) {
  return files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
}

const builtText = readCombined([
  ...collectTextFiles(buildPagesDir),
  ...collectTextFiles(staticExportDir),
]);
const sourceText = readCombined(sourceDirs.flatMap(collectTextFiles));
const searchableText = `${builtText}\n${sourceText}`;

const missingRequired = requiredCopy.filter((copy) => !searchableText.includes(copy));
const foundForbidden = forbiddenCopy.filter((copy) => searchableText.includes(copy));

if (missingRequired.length || foundForbidden.length) {
  console.error('Operon Kitchens build content verification failed.');
  if (missingRequired.length) {
    console.error('\nMissing required copy:');
    missingRequired.forEach((copy) => console.error(`- ${copy}`));
  }
  if (foundForbidden.length) {
    console.error('\nForbidden stale copy found:');
    foundForbidden.forEach((copy) => console.error(`- ${copy}`));
  }
  process.exit(1);
}

console.log('Operon Kitchens build content verification passed.');
