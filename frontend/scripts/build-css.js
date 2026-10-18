const A = require('@tailwindcss/oxide');
const { compile } = require('@tailwindcss/node');
const path = require('path');
const fs = require('fs');

async function buildCss() {
  const rootDir = path.resolve(__dirname, '..');
  const srcDir = path.join(rootDir, 'src');
  const inputCssPath = path.join(srcDir, 'app', 'globals.css');
  const outputCssPath = path.join(srcDir, 'app', 'tailwind-built.css');

  const css = fs.readFileSync(inputCssPath, 'utf-8');

  const res = await compile(css, {
    base: rootDir,
    from: inputCssPath,
    onDependency: () => {}
  });

  const scanner = new A.Scanner({
    sources: [{ base: srcDir, pattern: '**/*', negated: false }]
  });

  const candidates = [...scanner.scan()];
  const compiled = res.build(candidates);

  fs.writeFileSync(outputCssPath, compiled, 'utf-8');
  console.log(`[Tailwind] Generated ${outputCssPath} (${compiled.length} bytes, ${candidates.length} candidates)`);
}

buildCss().catch((err) => {
  console.error('[Tailwind] Build error:', err);
  process.exit(1);
});
