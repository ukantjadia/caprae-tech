// Generates a draft's index.html from Caprae_Tech_Section_Lab.html. Run from the draft folder:
//   bun ../dala-lab-engine/port-lab.js a
// Keeps every word, style and script of the Lab. Removes only the lab chrome (intro, lab
// bars, idea notes, dock, yellow notes) and fixes each section to this draft's variant.
// The other variants stay in the markup, hidden, because the Lab script fills all of them
// by id with no null checks (research/section-lab/01-inventory.md). Re-run after any Lab edit.
import fs from 'node:fs'
import path from 'node:path'

const letter = process.argv[2]
if (!['a', 'b', 'c'].includes(letter)) throw new Error('usage: port-lab.js a|b|c')
const lab = path.resolve(import.meta.dir, '../../Caprae_Tech_Section_Lab.html')
let html = fs.readFileSync(lab, 'utf8')

// ---- text patches: each must match exactly once, or the port stops ----
const patch = (from, to, why) => {
  const n = html.split(from).length - 1
  if (n !== 1) throw new Error(`patch "${why}": expected 1 match, found ${n}`)
  html = html.replace(from, () => to) // a function, so $$ and $& in `to` stay literal
}
// lab chrome offsets, re-tuned to the 64px nav now that the lab bar and dock are gone
patch('scroll-padding-top:120px', 'scroll-padding-top:80px', 'scroll padding')
patch('calc(100vh - 112px)', 'calc(100vh - 64px)', 'hero height')
patch('top:150px', 'top:96px', 'sticky offset (how C)')
patch('top:140px', 'top:88px', 'sticky offset (founders B)')
patch('padding:50px 0 120px;', 'padding:50px 0 50px;', 'footer dock space')
// the lab switching block goes; the toast it defines is part of the design (Book), so it stays
const a = html.indexOf('/* ======================= LAB SWITCHING ======================= */')
const b = html.indexOf('/* ======================= 01 HERO ======================= */')
if (a < 0 || b < 0) throw new Error('lab switching markers not found')
html = html.slice(0, a) + "const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)};\n\n" + html.slice(b)
// D-066 behaviour fixes, same look
patch("heroSw('shop'); setTimeout(()=>heroSw('founder'),3000);",
  "heroSw('shop'); let heroTouched=false; $$('.switch button').forEach(b=>b.addEventListener('click',()=>heroTouched=true)); setTimeout(()=>{if(!heroTouched)heroSw('founder')},3000); // an early click wins over the auto switch",
  'hero B timer')
patch("setInterval(()=>{ri=(ri+1)%ROT.length;",
  "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>{ri=(ri+1)%ROT.length;",
  'rotor reduced motion')
patch("h=$('#baHandle');let drag=false;", "h=$('#baHandle');let drag=false,kp=50;", 'compare state')
patch("h.style.left=p+'%'}", "h.style.left=p+'%';kp=p;ba.setAttribute('aria-valuenow',Math.round(p))}", 'compare value')
patch("['pointerup','pointercancel'].forEach(t=>ba.addEventListener(t,()=>drag=false));})();",
  "['pointerup','pointercancel'].forEach(t=>ba.addEventListener(t,()=>drag=false));" +
  // keyboard: the compare is a slider, arrows move it 5% at a time
  "ba.tabIndex=0;ba.setAttribute('role','slider');ba.setAttribute('aria-label','Compare dev shop and founder-led. Use the arrow keys.');ba.setAttribute('aria-valuemin','4');ba.setAttribute('aria-valuemax','96');ba.setAttribute('aria-valuenow','50');" +
  "ba.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;e.preventDefault();const r=ba.getBoundingClientRect();set(r.left+r.width*Math.min(96,Math.max(4,kp+(e.key==='ArrowRight'?5:-5)))/100)});})();",
  'compare keyboard')
// Google Fonts go: the draft self-hosts the same three families (D-065)
html = html.replace(/<link rel="preconnect"[^>]*>\s*/g, '').replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>\s*/g, '')
// our module: fonts, particle stage, claim markers, a11y fixes
html = html.replace('</body>', '<script type="module" src="/src/main.js"></script>\n</body>')

// ---- structural edits ----
const out = await new HTMLRewriter()
  .on('header.lab-intro', { element: e => e.remove() })
  .on('div.lab-bar', { element: e => e.remove() })
  .on('div.lab-idea', { element: e => e.remove() })
  .on('div.dock', { element: e => e.remove() })
  .on('span.note', { element: e => e.remove() }) // D-064: yellow notes stripped
  .on('section.lab', { element: e => e.setAttribute('data-section', '') })
  // D-063: an empty box that the hero shape is fitted into (see stage.js anchor): A = a band
  // across the top of the hero, B = the right side, C = the left side
  .on(letter === 'a' ? 'div.variant[data-v="a"] div.hA' : `div.variant[data-v="${letter}"] div.hero`, {
    element: e => e.prepend(`<div class="hero-mark${letter === 'b' ? ' side-right' : letter === 'c' ? ' side-left' : ''}" aria-hidden="true"></div>`, { html: true }),
  })
  // D-063: in draft A the particle field replaces the hero cube
  .on('div.cube-stage', { element: e => { if (letter === 'a') e.remove() } })
  .on(`div.variant[data-v="${letter}"]`, { element: e => e.setAttribute('class', 'variant on') })
  .on('title', { element: e => e.setInnerContent(`Caprae Tech · Draft ${letter.toUpperCase()}`) })
  .transform(new Response(html)).text()

fs.writeFileSync('index.html', out)
const count = s => out.split(s).length - 1
console.log(`index.html for draft ${letter.toUpperCase()}: ${count('class="variant on"')} sections on, ${count('data-section')} sections tagged, lab bars left: ${count('lab-bar"')}, notes left: ${count('class="note')}`)
