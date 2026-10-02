// Generates a Dala Lab draft's index.html from the Section Lab. Run from the draft folder:
//   bun ../dala-lab-engine/port-lab.js a
//   bun ../dala-lab-engine/port-lab.js cbaabacccb "Final draft 1"   (one pick per section, D-077)
//   bun ../dala-lab-engine/port-lab.js cbaabacccb "Final draft 2" final   (+ the content changes in final.js, D-080)
// The shared Lab handling (chrome removal, patches, variant switch) is in lab-source.js.
// This adds only what the particle drafts need. Re-run after any Lab edit.
import fs from 'node:fs'
import { labText, labRewriter, picksOf } from './lab-source.js'
import { finalText, finalRewrite } from './final.js'

const spec = process.argv[2]
const hero = picksOf(spec)[0] // the hero's variant decides where the hero shape sits
const title = process.argv[3] || `Draft ${spec.toUpperCase()}`
const final = process.argv[4] === 'final'
let rw = labRewriter(spec)
  // D-063: an empty box that the hero shape is fitted into (see stage.js anchor): A = a band
  // across the top of the hero, B = the right side, C = the left side
  .on(hero === 'a' ? 'div.variant[data-v="a"] div.hA' : `div.variant[data-v="${hero}"] div.hero`, {
    element: e => e.prepend(`<div class="hero-mark${hero === 'b' ? ' side-right' : hero === 'c' ? ' side-left' : ''}" aria-hidden="true"></div>`, { html: true }),
  })
  // D-063: with hero A the particle field replaces the hero cube
  .on('div.cube-stage', { element: e => { if (hero === 'a') e.remove() } })
  .on('title', { element: e => e.setInnerContent(`Caprae Tech · ${title}`) })
if (final) rw = finalRewrite(rw)
const src = labText('/src/main.js')
const out = await rw.transform(new Response(final ? finalText(src) : src)).text()

fs.writeFileSync('index.html', out)
const count = s => out.split(s).length - 1
console.log(`index.html for ${title}: ${count('class="variant on"')} sections on, ${count('data-section')} sections tagged, lab bars left: ${count('lab-bar"')}, notes left: ${count('class="note')}`)
