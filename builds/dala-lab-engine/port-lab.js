// Generates a Dala Lab draft's index.html from the Section Lab. Run from the draft folder:
//   bun ../dala-lab-engine/port-lab.js a
// The shared Lab handling (chrome removal, patches, variant switch) is in lab-source.js.
// This adds only what the particle drafts need. Re-run after any Lab edit.
import fs from 'node:fs'
import { labText, labRewriter } from './lab-source.js'

const letter = process.argv[2]
const out = await labRewriter(letter)
  // D-063: an empty box that the hero shape is fitted into (see stage.js anchor): A = a band
  // across the top of the hero, B = the right side, C = the left side
  .on(letter === 'a' ? 'div.variant[data-v="a"] div.hA' : `div.variant[data-v="${letter}"] div.hero`, {
    element: e => e.prepend(`<div class="hero-mark${letter === 'b' ? ' side-right' : letter === 'c' ? ' side-left' : ''}" aria-hidden="true"></div>`, { html: true }),
  })
  // D-063: in draft A the particle field replaces the hero cube
  .on('div.cube-stage', { element: e => { if (letter === 'a') e.remove() } })
  .on('title', { element: e => e.setInnerContent(`Caprae Tech · Draft ${letter.toUpperCase()}`) })
  .transform(new Response(labText('/src/main.js'))).text()

fs.writeFileSync('index.html', out)
const count = s => out.split(s).length - 1
console.log(`index.html for draft ${letter.toUpperCase()}: ${count('class="variant on"')} sections on, ${count('data-section')} sections tagged, lab bars left: ${count('lab-bar"')}, notes left: ${count('class="note')}`)
