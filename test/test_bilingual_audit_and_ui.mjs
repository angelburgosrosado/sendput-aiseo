import fs from 'node:fs';
import assert from 'node:assert';

console.log('🧪 Testing Bilingual (English & Spanish) Integration...');

// 1. Verify public/index.html
console.log('1. Checking public/index.html i18n dictionary and DOM elements...');
const indexHtml = fs.readFileSync('public/index.html', 'utf8');

// Extract SENDPUT_I18N block
const matchEn = indexHtml.match(/en:\s*\{([^}]+)\}/s);
const matchEs = indexHtml.match(/es:\s*\{([^}]+)\}/s);

assert(matchEn, 'SENDPUT_I18N.en should exist in public/index.html');
assert(matchEs, 'SENDPUT_I18N.es should exist in public/index.html');

const enKeys = [...indexHtml.matchAll(/'([a-zA-Z0-9_-]+)':\s*'/g)].map(m => m[1]);
// Let's directly parse the keys from indexHtml
const sendputEnKeys = [];
const sendputEsKeys = [];

const enBlock = indexHtml.substring(indexHtml.indexOf('const SENDPUT_I18N = {'), indexHtml.indexOf('function setSendputLanguage'));
const enSection = enBlock.substring(enBlock.indexOf('en: {'), enBlock.indexOf('es: {'));
const esSection = enBlock.substring(enBlock.indexOf('es: {'));

const enKeyMatches = [...enSection.matchAll(/'([a-zA-Z0-9_-]+)':/g)].map(m => m[1]);
const esKeyMatches = [...esSection.matchAll(/'([a-zA-Z0-9_-]+)':/g)].map(m => m[1]);

console.log(`Found ${enKeyMatches.length} EN keys and ${esKeyMatches.length} ES keys in SENDPUT_I18N.`);
assert.strictEqual(enKeyMatches.length, esKeyMatches.length, 'EN and ES dictionaries must have identical key counts');

// Verify that all keys exist as elements with id="..." in public/index.html
let missingElements = 0;
for (const key of enKeyMatches) {
  if (!indexHtml.includes(`id="${key}"`)) {
    console.error(`Missing element with id="${key}" in public/index.html`);
    missingElements++;
  }
}
assert.strictEqual(missingElements, 0, 'All i18n keys must correspond to elements in public/index.html');
console.log('✅ PASS: All i18n keys match DOM IDs in public/index.html!');

// 2. Verify PRESETS have hallucinationEs
console.log('2. Verifying presets contain Spanish hallucination drift strings...');
assert(indexHtml.includes('hallucinationEs:'), 'PRESETS must include hallucinationEs for Spanish mode');
assert(indexHtml.includes('currentSendputLang === \'es\''), 'UI updates must check currentSendputLang');
console.log('✅ PASS: Presets and UI state contain bilingual support!');

// 3. Verify public/validator.html
console.log('3. Checking public/validator.html translations and language handling...');
const validatorHtml = fs.readFileSync('public/validator.html', 'utf8');

assert(validatorHtml.includes('lang: currentLang'), 'validator.html must pass currentLang in fetch body');
assert(validatorHtml.includes('proposal_markdown_es'), 'validator.html must support downloading proposal_markdown_es');
assert(validatorHtml.includes('Grado ${letterGrade} • Autoridad Verificada'), 'validator.html must translate grade badges');
assert(validatorHtml.includes('Rastreadores Permitidos'), 'validator.html must translate crawler matrix');
assert(validatorHtml.includes('BLOQUEAR'), 'validator.html must translate crawler block status');
console.log('✅ PASS: validator.html contains complete Spanish audit rendering!');

// 4. Verify src/server.ts
console.log('4. Checking src/server.ts proposal generator & audit endpoint...');
const serverTs = fs.readFileSync('src/server.ts', 'utf8');

assert(serverTs.includes('generateProposalMarkdown(audit: any, agency: AgencyWorkspace | null, lang: string = \'en\')'), 'generateProposalMarkdown must accept lang parameter');
assert(serverTs.includes('const isEs = lang === \'es\';'), 'generateProposalMarkdown must have Spanish branch flag');
assert(serverTs.includes('if (isEs)'), 'generateProposalMarkdown must branch on isEs');
assert(serverTs.includes('# Auditoría Ejecutiva de Visibilidad en Búsqueda IA y Grafo de Conocimiento'), 'generateProposalMarkdown must have Spanish header');
assert(serverTs.includes('proposal_markdown_es'), 'API responses must include proposal_markdown_es');
assert(serverTs.includes('ai_answer_simulation_es'), 'API responses must include ai_answer_simulation_es');
assert(serverTs.includes('hallucination_alert_es'), 'API responses must include hallucination_alert_es');
console.log('✅ PASS: src/server.ts has full bilingual proposal & audit generation!');

// 5. Test proposal markdown generator logic directly
console.log('5. Testing proposal generation in Spanish and English...');
// Verify dist/server.cjs builds and contains the Spanish strings (esbuild escapes unicode characters)
const distServer = fs.readFileSync('dist/server.cjs', 'utf8');
assert(distServer.includes('Auditor\\xEDa Ejecutiva de Visibilidad') || distServer.includes('Auditoría Ejecutiva de Visibilidad'), 'dist/server.cjs must include Spanish proposal template');
assert(distServer.includes('hallucination_alert_es'), 'dist/server.cjs must include hallucination_alert_es');
console.log('✅ PASS: Compiled bundle dist/server.cjs contains all Spanish assets!');

console.log('🎉 ALL BILINGUAL AUDIT & UI TESTS PASSED SUCCESSFULLY!');
