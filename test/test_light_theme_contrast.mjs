import fs from 'node:fs';
import assert from 'node:assert';

console.log('🧪 Testing Light Theme Revision & GEO Engine Brand Standard Compliance...');

const files = [
  'public/index.html',
  'index.html',
  'public/sendput-app.html',
  'public/validator.html',
  'public/guide.html',
  'public/global-local.html',
  'public/spec.html'
];

for (const file of files) {
  console.log(`Checking ${file}...`);
  const content = fs.readFileSync(file, 'utf8');

  // Verify light theme body background & base color
  assert(content.includes('html.light body'), `${file} must include html.light body rule`);
  assert(content.includes('#F8FAFC'), `${file} must use #F8FAFC cool gray base in light theme`);
  assert(content.includes('#0F172A'), `${file} must use #0F172A titanium/slate text base in light theme`);

  // Verify high-contrast color token remapping (Matrix Green, Signal Orange, Cyan/Signal Blue)
  assert(content.includes('#047857'), `${file} must remap Matrix Green / Emerald to #047857 for accessible contrast`);
  assert(content.includes('#0284C7'), `${file} must remap Cyan to #0284C7 for accessible contrast`);
  assert(content.includes('#C2410C'), `${file} must remap Signal Orange to #C2410C for accessible contrast`);

  // Verify white card / container styling
  assert(content.includes('#FFFFFF !important'), `${file} must style cards with clean white background in light mode`);
  assert(content.includes('#CBD5E1'), `${file} must use #CBD5E1 border token in light mode`);

  console.log(`✅ PASS: ${file} complies with Brand Standards v3.2 light theme!`);
}

// Check Chart.js dynamic theme integration in public/index.html
console.log('Checking Chart.js dynamic theme contrast in public/index.html...');
const indexContent = fs.readFileSync('public/index.html', 'utf8');
assert(indexContent.includes('chartInstance.options.scales.y.ticks.color = isLight ? \'#475569\' : \'#94A3B8\''), 'applySendputTheme must update Y ticks');
assert(indexContent.includes('chartInstance.options.plugins.legend.labels.color = isLight ? \'#0F172A\' : \'#E2E8F0\''), 'applySendputTheme must update legend text color');
console.log('✅ PASS: Chart.js scales dynamically with light and dark themes!');

console.log('🎉 ALL LIGHT THEME & BRAND CONTRAST TESTS PASSED SUCCESSFULLY!');

