/* The full-motion tier cannot be seen on a machine that has reduced motion on,
 * because the gate is a media query in BOTH the Astro client directive and the
 * CSS. This writes a review-only copy of the build with both neutralised.
 * It is a review artifact, never a shipping page. Run: bun run review
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const css = readdirSync('dist/assets').find((f) => /^style\..*\.css$/.test(f));
if (!css) throw new Error('no built stylesheet found; run `bun run build` first');
writeFileSync('dist/assets/review.css',
  readFileSync(`dist/assets/${css}`, 'utf8')
    .replaceAll('prefers-reduced-motion:reduce', 'prefers-reduced-motion:__review__'));
writeFileSync('dist/index.fullmotion.html',
  readFileSync('dist/index.html', 'utf8')
    .replace('(prefers-reduced-motion: no-preference)', '(min-width: 1px)')
    .replaceAll(css, 'review.css'));
console.log(`review copy written: dist/index.fullmotion.html (from ${css})`);
