/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

function buildStandalone() {
  try {
    const distDir = path.join(process.cwd(), 'dist');
    const assetsDir = path.join(distDir, 'assets');

    console.log('Generating single self-contained HTML bundle...');

    // 1. Read files in the assets output directory
    const files = fs.readdirSync(assetsDir);
    const jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
    const cssFile = files.find(f => f.startsWith('index-') && f.endsWith('.css'));

    if (!jsFile || !cssFile) {
      throw new Error(`Could not find compiled JS or CSS assets in ${assetsDir}`);
    }

    console.log(`Found JS: ${jsFile}`);
    console.log(`Found CSS: ${cssFile}`);

    // 2. Read index.html inside dist/
    const htmlPath = path.join(distDir, 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // 3. Read JS and CSS contents
    const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
    const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');

    // Remove source mapping comments to reduce size if necessary (optional, but good practice)
    const cleanJs = jsContent.replace(/\/\/# sourceMappingURL=.+$/, '');
    const cleanCss = cssContent.replace(/\/\*# sourceMappingURL=.+?\s*\*\//, '');

    // 4. Perform surgical replacement of script tag and stylesheet link
    // Replace script tag: <script type="module" crossorigin src="/assets/index-...js"></script>
    const scriptRegex = /<script\s+type="module"\s+crossorigin\s+src="\/assets\/index-.+?\.js"><\/script>/i;
    const inlineScript = `<script type="module">
${cleanJs}
</script>`;

    // Replace CSS stylesheet link: <link rel="stylesheet" crossorigin href="/assets/index-...css">
    const cssRegex = /<link\s+rel="stylesheet"\s+crossorigin\s+href="\/assets\/index-.+?\.css"\s*\/?>|<link\s+rel="stylesheet"\s+href="\/assets\/index-.+?\.css"\s*\/?>/i;
    const inlineCss = `<style>
${cleanCss}
</style>`;

    if (!scriptRegex.test(htmlContent)) {
      console.warn('Warning: Could not match exact <script> tag via regex, trying fallback replace...');
      htmlContent = htmlContent.replace(/\/assets\/index-.+?\.js/i, (match) => {
        return 'data:text/javascript;base64,' + Buffer.from(cleanJs).toString('base64');
      });
    } else {
      htmlContent = htmlContent.replace(scriptRegex, inlineScript);
    }

    if (!cssRegex.test(htmlContent)) {
      console.warn('Warning: Could not match exact <link rel="stylesheet"> tag via regex, trying fallback replace...');
      htmlContent = htmlContent.replace(/\/assets\/index-.+?\.css/i, (match) => {
        return 'data:text/css;base64,' + Buffer.from(cleanCss).toString('base64');
      });
    } else {
      htmlContent = htmlContent.replace(cssRegex, inlineCss);
    }

    // 5. Output the single standalone HTML file inside dist/ and at workspace root
    const outputStandalonePath = path.join(distDir, 'smart-sps-lab.html');
    fs.writeFileSync(outputStandalonePath, htmlContent, 'utf8');
    console.log(`Standalone HTML created: ${outputStandalonePath}`);

    const rootOutputPath = path.join(process.cwd(), 'smart-sps-lab.html');
    fs.writeFileSync(rootOutputPath, htmlContent, 'utf8');
    console.log(`Standalone HTML copied to workspace root: ${rootOutputPath}`);

    console.log('Successfully completed building static, standalone version of SMART SPS LAB!');
  } catch (error) {
    console.error('Error generated while building single HTML:', error);
    process.exit(1);
  }
}

buildStandalone();
