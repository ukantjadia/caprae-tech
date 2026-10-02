// Final drafts 2 and 3 (D-080): the user's content changes on top of the ported Lab.
// finalText edits the Lab's source text (its inline script and markup); finalRewrite adds
// markup with HTMLRewriter. Both are used by port-lab.js when it runs with "final".
// Styles: final.css. Behaviour that needs the page (scroll-in animations): final-page.js.

// each edit must match exactly once, or the port stops (same rule as lab-source.js)
const patcher = html => {
  const patch = (from, to, why) => {
    const n = html.split(from).length - 1
    if (n !== 1) throw new Error(`final patch "${why}": expected 1 match, found ${n}`)
    html = html.replace(from, () => to)
  }
  return { patch, get: () => html }
}

// proof links: the public site of the company each build runs in (searched 2026-10-02).
// Simba has no site we could find, so it gets no button.
const SOURCES = {
  'Caprae CRM': 'capraecapitalpartners.com',
  'Recruitment pipeline': 'capraecapitalpartners.com',
  'Lead QA': 'capraecapitalpartners.com',
  'Call intelligence': 'capraecapitalpartners.com',
  'Bankers Edge': 'bankersedgeadvisory.com',
  ITSco: 'itsco.com',
  'Destroy Drive': 'destroydrive.com',
}

export function finalText(src) {
  const { patch, get } = patcher(src)

  // hero C: the industry word types itself out, then deletes, instead of swapping every 2.2 s
  patch("if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>{ri=(ri+1)%ROT.length;$('#rotor').innerHTML=`<span>${ROT[ri]}</span>`},2200);",
    "if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const rot=$('#rotor'),out=rot.firstElementChild;rot.classList.add('typing');let n=ROT[0].length,dir=-1;" +
    "const tick=()=>{n+=dir;if(n<0){ri=(ri+1)%ROT.length;n=0;dir=1}out.textContent=ROT[ri].slice(0,n);" +
    "if(dir>0&&n===ROT[ri].length){dir=-1;return setTimeout(tick,1900)}setTimeout(tick,dir>0?85:40)};setTimeout(tick,2200)}",
    'typing rotor')

  // proof: a source button per card, showing the domain
  for (const [name, domain] of Object.entries(SOURCES)) patch(`{n:"${name}",`, `{n:"${name}",u:"${domain}",`, `source ${name}`)
  patch("$('#workGrid').innerHTML=WORK.map(",
    "const srcBtn=w=>w.u?`<a class=\"src-btn\" href=\"https://${w.u}\" target=\"_blank\" rel=\"noopener\"><span class=\"src-dom\">${w.u}</span><span aria-hidden=\"true\">↗</span></a>`:'';\n$('#workGrid').innerHTML=WORK.map(",
    'source button helper')
  patch('<div class="res"><b>${w.rb}</b><span class="muted">${w.rs}</span>${noteTag(w)}</div></div>`',
    '<div class="res"><b>${w.rb}</b><span class="muted">${w.rs}</span>${noteTag(w)}</div>${srcBtn(w)}</div>`', 'source button')

  // book: no calendar. The button books, the thank-you says what happens next.
  patch('<button class="btn btn-white" type="submit" style="width:100%;margin-top:4px">Continue to calendar →</button>',
    '<button class="btn btn-white btn-book" type="submit" style="width:100%;margin-top:4px">Book a call <span class="arr" aria-hidden="true">→</span></button>', 'book button')
  patch('Four fields. Next step: pick a time.', "Four fields. We'll email you to set the time.", 'form hint')
  const a = get().indexOf('function calHTML(first){'), b = get().indexOf('pre-filled with name + email</span>`}')
  if (a < 0 || b < 0) throw new Error('final patch "thank-you": calHTML not found')
  patch(get().slice(a, b + 'pre-filled with name + email</span>`}'.length),
    "function calHTML(first,email){return `<div class=\"done-ico\" aria-hidden=\"true\">✓</div><div style=\"font-family:var(--serif);font-size:32px\">Thanks, ${esc(first)}.</div><p class=\"muted\" style=\"margin-top:8px\">We'll email you at ${esc(email)} to set up your 30-minute call.</p>`}",
    'thank-you')
  patch('done.innerHTML=calHTML(val.first);', 'done.innerHTML=calHTML(val.first,val.email);', 'thank-you call')

  // what we build: each box carries the matching proof result and a small moving picture of it
  patch('<span class="note block">mock numbers, illustration only</span></div>', '</div>', 'mvp note')
  patch('<span class="tag">Owners · Ops leads</span></div>',
    `${result('crm', '1 click', 'Caprae CRM: a client sees the whole account, instead of a weekly call')}<span class="tag">Owners · Ops leads</span></div>`, 'dashboards result')
  patch('help you evaluate and acquire businesses.</p></div></div>',
    `help you evaluate and acquire businesses.</p></div>${result('live', 'Live', 'Bankers Edge advisory platform, in production')}</div>`, 'deal result')
  patch('added only where they pay back.</p></div></div>',
    `added only where they pay back.</p></div>${result('qa', '30 → 10 hrs/wk', 'Lead QA: AI scores every lead, a human spot-checks')}</div>`, 'ai result')
  patch('instead of ten spreadsheets.</p></div></div>',
    `instead of ten spreadsheets.</p></div>${result('pipe', '~20 hrs/wk', 'Recruitment pipeline: returned to the recruitment team')}</div>`, 'internal result')
  return get()
}

// a result strip: an animated picture (CSS, final.css .fx-*) plus the number and its source
function result(kind, num, text) {
  const pic = {
    crm: '<div class="fx fx-crm"><i></i><i></i><i></i><b class="cur"></b></div>',
    live: '<div class="fx fx-live"><span class="dot"></span>LIVE</div>',
    qa: '<div class="fx fx-qa"><i></i><i></i><i></i><i></i></div>',
    pipe: '<div class="fx fx-pipe"><span></span><span></span><span></span><span></span><b></b></div>',
  }[kind]
  return `<div class="svc-res">${pic}<div class="svc-num"><b>${num}</b><span>${text}</span></div></div>`
}

// call signs (user's choice 2026-10-02: suggested, change any time); photos go in the avatar
const TEAM = [
  ['Siddhant Pahuja', 'SP', 'Overwatch', 'Head of AI & Automation'],
  ['Ukant', 'U', 'Pointman', 'Lead engineer'],
  ['Hiten', 'H', 'Recon', 'Engineer'],
  ['Dejan', 'D', 'Sapper', 'Engineer'],
]

export function finalRewrite(rw) {
  return rw
    // the statement band between the hero and Why founders
    .on('section#hero', {
      element: e => e.after(`<div class="statement"><div class="wrap"><p class="statement-line">Dev shops build what you ask.<br><span class="grad-text it">Founders build what sells.</span></p></div></div>`, { html: true }),
    })
    // build team C: a card per person with a photo slot and a call sign, in place of the rows
    .on('section#team div.variant[data-v="c"] div.rows', {
      element: e => {
        e.setAttribute('class', 'crew')
        e.setInnerContent(TEAM.map(([name, ini, sign, role]) =>
          `<div class="card crew-card"><div class="avatar" aria-hidden="true">${ini}</div><div><div class="sign">“${sign}”</div><h3>${name}</h3><div class="dim">${role}</div></div></div>`).join(''), { html: true })
      },
    })
}
