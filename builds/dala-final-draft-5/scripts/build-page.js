// Final draft 5 (D-083): draft 2's content in new layouts. Writes index.html.
//   bun scripts/build-page.js
// Lists (comparison, proof, features, founders, FAQ) are read from the Section Lab's own
// script, and the proof results, sources and crew from dala-lab-engine/final.js, so the text
// stays the Lab's. Headings and short lines below are copied from the picked Lab variants.
import fs from 'node:fs'
import { LAB_FILE } from '../../dala-lab-engine/lab-source.js'
import { SOURCES, SERVICE_RESULTS, TEAM, result } from '../../dala-lab-engine/final.js'

const lab = fs.readFileSync(LAB_FILE, 'utf8')
const list = name => {
  const m = lab.match(new RegExp(`const ${name}=(\\[[\\s\\S]*?\\]|\\{[\\s\\S]*?\\});`))
  if (!m) throw new Error(`Lab list ${name} not found`)
  return new Function(`return ${m[1]}`)()
}
const CMP = list('CMP'), WORK = list('WORK'), GRP = list('GRP'), STATUS = list('STATUS')
const FEATURES = list('FEATURES'), FOUNDERS = list('FOUNDERS'), FAQ = list('FAQ'), ROT = list('ROT')
if (CMP.length !== 6 || WORK.length !== 8 || FEATURES.length !== 10 || FOUNDERS.length !== 4 || FAQ.length !== 8 || ROT.length !== 5) throw new Error('Lab lists changed size; check the layouts')
for (const w of WORK) w.u = SOURCES[w.n]

const ARR = '<span class="arr" aria-hidden="true">→</span>'
const head = (n, eyebrow, title, lead = '') => `<header class="s-head"><div class="s-num mono">${n}</div><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2></div>${lead ? `<p class="lead">${lead}</p>` : ''}</header>`

// 01 hero: left-aligned, the industry types itself; the particle C sits on the right
const hero = `<section data-section id="hero" class="hero s-hero"><div class="hero-mark side-right" aria-hidden="true"></div>
  <div class="wrap">
    <span class="eyebrow">Founder-led software</span>
    <h1>Software for <span class="rotor it grad-text" id="rotor"><span>${ROT[0]}</span></span><br>run by people who've<br>built companies.</h1>
    <div class="hero-foot">
      <p class="lead">MVPs, dashboards, deal models and internal tools for owners who don't have a tech team, and don't want to become one.</p>
      <div class="cta-row"><a class="btn btn-primary" href="#book">Book a call ${ARR}</a><a class="btn btn-quiet" href="#services">What we build</a></div>
    </div>
  </div></section>`

// the statement, split down the middle: what you get elsewhere, and what you get here
const statement = `<div class="split" aria-label="Dev shops build what you ask. Founders build what sells.">
  <p class="split-line split-l"><span class="mono">Dev shops</span>build what you ask.</p>
  <p class="split-line split-r"><span class="mono">Founders</span><span class="it grad-text">build what sells.</span></p>
</div>`

// 02 why: a redline. Each question, the dev-shop answer struck through, ours in its place.
const why = `<section data-section id="why"><div class="wrap">
  ${head('01', 'Why founder-led', 'Same code. <span class="it">Different judgment.</span>', 'Anyone can write the code. The expensive part is knowing what to build, what to leave out, and how to sell what ships.')}
  <dl class="redline">${CMP.map(([q, shop, us]) => `<div class="rl-row"><dt class="mono">${q}</dt><dd><s class="rl-shop"><span class="sr">Typical dev shop: </span>${shop}</s><span class="rl-us"><span class="sr">Caprae Tech: </span>${us}</span></dd></div>`).join('')}</dl>
  <div class="rl-key mono"><span><s>Struck</s> typical dev shop</span><span><b>Bold</b> Caprae Tech</span></div>
</div></section>`

// 03 what we build: a numbered index, one row per build type, its result on the right
const SVC = [
  ['MVPs', 'Go from an idea to a working product your customers can use, with the features that will sell it at the top.'],
  ['Dashboards', 'Your whole business on one screen: sales, ops and finance, pulled from the tools you already use.'],
  ['Deal & financial tools', 'Models and screeners that help you evaluate and acquire businesses.'],
  ['AI assistants', 'Automations that take the repetitive work off your team, added only where they pay back.'],
  ['Internal team tools', 'Portals, trackers and workflows your people use every day, instead of ten spreadsheets.'],
]
const MVP_DASH = `<div class="mini-dash"><div><small>Active users</small><b>1,284</b></div><div><small>Conversion</small><b>6.2%</b></div><div><small>MRR</small><b>$18k</b></div><div class="mock-bars">${[30, 45, 38, 60, 55, 72, 80, 95].map(h => `<i style="height:${h}%"></i>`).join('')}</div></div>`
const services = `<section data-section id="services"><div class="wrap">
  ${head('02', 'What we build', 'Your idea, shipped<br><span class="it muted">and ready to sell.</span>', "For owners in staffing, healthcare, services and acquisitions who need software but don't have a tech team.")}
  <ol class="index">${SVC.map(([t, d], i) => `<li class="ix-row"><span class="ix-n mono">0${i + 1}</span><h3>${t}</h3><p>${d}</p><div class="ix-res">${SERVICE_RESULTS[t] ? result(...SERVICE_RESULTS[t]) : MVP_DASH}</div></li>`).join('')}</ol>
</div></section>`

// 04 proof: a ledger. One line per project, filterable, the result and its source on the right.
const counts = { all: WORK.length }; for (const w of WORK) counts[w.g] = (counts[w.g] || 0) + 1
const work = `<section data-section id="work"><div class="wrap">
  ${head('03', 'Proof', 'We built it for ourselves first.', "Every tool here runs inside a real business, either ours, a client's or a company our founders built.")}
  <div class="tabs" role="group" aria-label="Filter projects">${[['all', 'All'], ...Object.entries(GRP)].map(([k, v], i) => `<button class="mono${i ? '' : ' on'}" data-f="${k}" aria-pressed="${!i}">${v} <span>${counts[k]}</span></button>`).join('')}</div>
  <table class="ledger"><thead><tr><th>Project</th><th>What we built</th><th>Result</th><th><span class="sr">Source</span></th></tr></thead><tbody>
  ${WORK.map(w => `<tr data-g="${w.g}"><td><b>${w.n}</b><span class="mono">${GRP[w.g]} · <i class="st st-${STATUS[w.s][1]}">${STATUS[w.s][0]}</i></span></td><td><span class="k">${w.k}</span>${w.b}</td><td class="num">${w.rb}<span>${w.rs}</span></td><td>${w.u ? `<a class="src mono" href="https://${w.u}" target="_blank" rel="noopener">${w.u} <span aria-hidden="true">↗</span></a>` : ''}</td></tr>`).join('')}
  </tbody></table>
</div></section>`

// 05 how: the week as one line, Monday to Friday; Thursday's check-in rises above it
const WEEK = [
  ['MON', ["Founder sets the week's priorities: what ships and what waits", 'Engineers build']],
  ['TUE', ['Engineers build', 'Tested against how a real user works']],
  ['WED', ['Founder review: does this feature sell?', 'Cut or reorder features']],
  ['THU', ['Your weekly check-in: demo, decisions, next week', 'Your feedback goes into the plan'], true],
  ['FRI', ['Ship to staging', 'Hours used vs. planned, sent to you']],
]
const how = `<section data-section id="how"><div class="wrap">
  ${head('04', 'How it works', 'Your week with us.', 'Everything in grey is us. The purple box is the only part that needs you.')}
  <ol class="track">${WEEK.map(([d, ev, you]) => `<li class="tk${you ? ' you' : ''}"><span class="tk-d mono">${d}</span><span class="tk-dot" aria-hidden="true"></span>${ev.map((e, i) => `<p class="${you && !i ? 'tk-you' : ''}">${e}</p>`).join('')}</li>`).join('')}</ol>
</div></section>`

// 06 pricing: a menu with dotted leaders on the left, a running receipt on the right
const pricing = `<section data-section id="pricing"><div class="wrap">
  ${head('05', 'Pricing', 'You pick the features.<br><span class="it muted">You see the hours.</span>', 'No random quote. We scope your product into features, each with an hour estimate, at a fixed hourly rate for your domain. Change direction and the hours change with it.')}
  <div class="menu-wrap">
    <ul class="menu">${FEATURES.map(([n, h, d], i) => `<li><label><input type="checkbox" data-h="${h}" data-n="${n}"${i < 3 ? ' checked' : ''}><span class="m-name">${n}<small>${d}</small></span><span class="m-dots" aria-hidden="true"></span><span class="m-h mono">${h} h</span></label></li>`).join('')}</ul>
    <aside class="receipt panel" aria-live="polite"><div class="mono r-title">Your build</div><ul class="r-lines" id="rLines"></ul>
      <div class="r-total"><span>Estimated build</span><b class="num"><span id="rHours">0</span> hours</b></div>
      <div class="r-rate"><span>× your domain's hourly rate</span><span class="mono">set on the call</span></div>
      <a class="btn btn-primary" href="#book">Book a call ${ARR}</a></aside>
  </div>
</div></section>`

// 07 founders: one wide row each, monogram, the one-line record, then the detail
const founders = `<section data-section id="founders"><div class="wrap">
  ${head('06', 'The founders', 'The people in<br><span class="it muted">your CTO seat.</span>', "They've built, bought and grown companies in tech, healthcare, data and acquisitions.")}
  <div class="people">${FOUNDERS.map(f => `<article class="person"><div class="mono-gram" aria-hidden="true">${f.i}</div><div class="p-body"><span class="mono p-role">${f.r}</span><h3>${f.n}</h3><p class="p-q">${f.q}</p><p class="p-b">${f.b}</p><div class="p-tags">${f.t.map(t => `<span class="tag">${t}</span>`).join('')}</div></div></article>`).join('')}</div>
</div></section>`

// 08 team: a crew manifest, call sign first
const team = `<section data-section id="team"><div class="wrap">
  ${head('07', 'The build team', 'Small team.<br><span class="it muted">Senior judgment.</span>')}
  <div class="manifest">${TEAM.map(([name, ini, sign, role, owns]) => `<div class="mf-row"><div class="mf-photo" aria-hidden="true">${ini}</div><div class="mf-sign mono">“${sign}”</div><div class="mf-name"><b>${name}</b><span>${role}</span></div><p class="mf-owns">${owns}</p></div>`).join('')}</div>
</div></section>`

// 09 FAQ: the questions as a list on the left (blue), the open answer large on the right (green)
const faq = `<section data-section id="faq"><div class="wrap">
  ${head('08', 'Questions', 'You ask. <span class="it muted">We answer.</span>')}
  <div class="qa">
    <div class="qa-list" role="tablist" aria-label="Questions">${FAQ.map(([q], i) => `<button role="tab" id="qt${i}" aria-controls="qp${i}" aria-selected="${!i}" tabindex="${i ? -1 : 0}"><span class="mono">Q${i + 1}</span>${q}</button>`).join('')}</div>
    <div class="qa-view panel">${FAQ.map(([q, a], i) => `<div role="tabpanel" id="qp${i}" aria-labelledby="qt${i}"${i ? ' hidden' : ''}><span class="mono a-k">Caprae Tech</span><p class="a-q">${q}</p><p class="a-a">${a}</p></div>`).join('')}</div>
  </div>
</div></section>`

// 10 book: the promise as three numbered lines, the form beside it, no calendar
const book = `<section data-section id="book"><div class="wrap">
  ${head('09', 'Book a call', 'Thirty minutes.<br><span class="it muted">A founder on the other end.</span>')}
  <div class="book">
    <ol class="promise">
      <li><span class="num">1</span><div><b>You tell us the idea or the problem.</b>No tech words needed.</div></li>
      <li><span class="num">2</span><div><b>We tell you what's worth building and what isn't.</b>Including when AI helps and when it doesn't.</div></li>
      <li><span class="num">3</span><div><b>You get a feature list with hours.</b>At a fixed hourly rate for your domain. You decide from there.</div></li>
    </ol>
    <div class="panel book-card"><form class="form" novalidate>
      <div class="two"><label class="field">First name<input name="first" autocomplete="given-name" placeholder="Jane" required><span class="msg">Required</span></label>
      <label class="field">Last name<input name="last" autocomplete="family-name" placeholder="Doe" required><span class="msg">Required</span></label></div>
      <label class="field">Work email<input name="email" type="email" autocomplete="email" placeholder="jane@company.com" required><span class="msg">Enter a valid email</span></label>
      <label class="field">What's the call about?<textarea name="reason" placeholder="e.g. We run a staffing firm and want a client portal instead of emailing timesheets." required></textarea><span class="msg">Tell us a line or two</span></label>
      <button class="btn btn-primary btn-wide" type="submit">Book a call ${ARR}</button>
      <p class="hint mono">Four fields. We'll email you to set the time.</p>
    </form><div class="done" hidden></div></div>
  </div>
</div></section>`

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Caprae Tech · Final draft 5</title>
<meta name="description" content="Founder-led software for owners who don't have a tech team.">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<nav class="topbar" aria-label="Main"><div class="wrap">
  <a class="brand" href="#hero">Caprae <span>Tech</span></a>
  <div class="links"><a href="#why">Why founders</a><a href="#work">Work</a><a href="#how">How it works</a><a href="#pricing">Pricing</a><a href="#founders">People</a></div>
  <a class="btn btn-primary btn-sm" href="#book">Book a call</a>
</div></nav>
<main id="main">
${hero}
${statement}
${why}
${services}
${work}
${how}
${pricing}
${founders}
${team}
${faq}
${book}
</main>
<footer class="foot"><div class="wrap">
  <div><div class="brand">Caprae <span>Tech</span></div><p>Founder-led product studio. Part of Caprae Capital Partners.</p></div>
  <div class="links"><a href="#work">Work</a><a href="#how">How it works</a><a href="#pricing">Pricing</a><a href="#founders">People</a><a href="#book">Book a call</a></div>
</div></footer>
<script type="module" src="/src/main.js"></script>
</body>
</html>
`
fs.writeFileSync(new URL('../index.html', import.meta.url), html)
console.log(`index.html: ${(html.match(/data-section/g) || []).length} sections, ${WORK.filter(w => w.u).length} source links, ${FAQ.length} questions`)
