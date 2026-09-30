// "To confirm" markers (D-064). Every Section Lab claim the proof files do not back as
// [VERIFIED] gets a visible marker right after its phrase. Row numbers refer to the claims
// table in research/section-lab/01-inventory.md. Not marked, by the user's choice: the
// "founder-led" framing (row 6, wording kept) and the "Caprae Tech" name (row 4, naming).
// The Lab renders much of its text from data arrays and re-renders it on tab clicks, so the
// markers are applied to the live DOM and re-applied when it changes.

const NOT_FOUND = 'Not in the proof files'
const CLAIMS = [
  ['Caprae Capital Partners', `${NOT_FOUND} as a company name (row 5)`],
  ['once a week', 'Meeting cadence is open, Q10 (row 7)'],
  ['weekly check-in', 'Meeting cadence is open, Q10 (row 7)'],
  ['check-in a week', 'Meeting cadence is open, Q10 (row 7)'],
  ['You get one check-in', 'Meeting cadence is open, Q10 (row 7)'],
  ['hourly rate', 'Pricing model is open, Q4 (row 8)'],
  ['Hours per feature', 'Pricing model is open, Q4 (row 8)'],
  ['Estimated build', 'Hours are illustrative (row 9)'],
  ['Total in scope', 'Illustrative sample, not a real client (row 9)'],
  ['Active users', 'Mock numbers, illustration only (row 10)'],
  ['The same kind of tooling Caprae uses to find and buy companies.', `${NOT_FOUND} as worded (row 11)`],
  ['For owners in staffing, healthcare, services and acquisitions', `${NOT_FOUND}: target industries (row 12)`],
  ['compliance needs', `${NOT_FOUND}: data safety wording (rows 13, 55)`],
  ['Caprae CRM', `${NOT_FOUND} (row 14)`],
  ['1 click', `${NOT_FOUND} (row 14)`],
  ['Recruitment pipeline', `${NOT_FOUND} (row 15)`],
  ['~20 hrs/wk', `${NOT_FOUND} (row 15)`],
  ['Lead QA', `${NOT_FOUND} (row 16)`],
  ['1.5 hours per client', `${NOT_FOUND} (row 16)`],
  ['30 → 10 hrs/wk', `${NOT_FOUND} (row 16)`],
  ['30→10', `${NOT_FOUND} (row 16)`],
  ['6→50+', `${NOT_FOUND} (row 17)`],
  ['In build', 'Status contradicted: proof says Call Intelligence is sold standalone (row 18)'],
  ['Bankers Edge', 'Stated, partly corroborated; client attribution pending (row 19)'],
  ['Simba', 'Stated, unverified (row 20)'],
  ['Founder company', 'Framing conflicts with D-004: ITSco is a portfolio company (row 21)'],
  ['Founder co.', 'Framing conflicts with D-004: ITSco is a portfolio company (row 21)'],
  ['Healthcare tech', `${NOT_FOUND} (row 22)`],
  ['Mike Savano', `${NOT_FOUND}; proof lists a "Mike Savino" as an Advisor (rows 23, 44)`],
  ['co-founded by Kevin Hong and Zackary Beckham', 'Contradicted: Zackary was Director of Service Delivery at Destroy Drive (row 24)'],
  ['Co-founder of Destroy Drive', 'Contradicted by the proof files (row 24)'],
  ['10+ years of experience', `${NOT_FOUND} (row 27)`],
  ['$31M and $7M ARR', 'Mismatch: $7M is revenue, not ARR (row 28)'],
  ['$31M & $7M ARR', 'Mismatch: $7M is revenue, not ARR (row 28)'],
  ['zero to $31M ARR', `"From zero" ${NOT_FOUND} (row 28)`],
  ['$8M+', `${NOT_FOUND} (row 29)`],
  ['The Outlier Approach', `${NOT_FOUND} (row 30)`],
  ['Chapman University', `${NOT_FOUND} (row 31)`],
  ['Knows exactly what an acquirer needs from a tool.', `${NOT_FOUND}: opinion copy (row 38)`],
  ['Has run delivery for technical services at scale.', `${NOT_FOUND}: opinion copy (row 43)`],
  ['built, bought and grown companies in tech, healthcare, data and acquisitions', `${NOT_FOUND} (row 45)`],
  ['Siddhant Pahuja', `${NOT_FOUND} (row 46)`],
  ['Ukant', `${NOT_FOUND}: names need surnames and consent (row 47)`],
  ['Hiten', `${NOT_FOUND}: names need surnames and consent (row 47)`],
  ['Dejan', `${NOT_FOUND}: names need surnames and consent (row 47)`],
  ['Small team.', 'Conflicts with the public 20+ engineers figure (row 48)'],
  ['OpenAI', `${NOT_FOUND}: stack (row 49)`],
  ['n8n', `${NOT_FOUND}: stack (row 49)`],
  ['Supabase', `${NOT_FOUND}: stack (row 49)`],
  ['Azure', `${NOT_FOUND}: stack (row 49)`],
  ['FastAPI', `${NOT_FOUND}: stack (row 49)`],
  ['Twilio', `${NOT_FOUND}: stack (row 49)`],
  ['with a founder', `${NOT_FOUND} (row 52)`],
  ['A founder on the other end.', `${NOT_FOUND} (row 52)`],
  ['Pacific Time', `${NOT_FOUND} (row 53)`],
  ['You own what you pay for.', `${NOT_FOUND}: confirm with Kevin (row 54)`],
  ['Engineers ship', `${NOT_FOUND} (row 56)`],
  ["[Add the client's problem]", 'Placeholder text in the Lab'],
  ['[domain rate]', 'Placeholder: rate pending'],
  ['set on the call', 'Placeholder: rate pending'],
].sort((a, b) => b[0].length - a[0].length) // longest first, so a phrase inside a longer one is not marked twice

const SKIP = 'script,style,textarea,option,title,.tc,.particle-field'

function markText(node) {
  const text = node.nodeValue
  let best = null
  for (const [phrase, why] of CLAIMS) {
    const i = text.indexOf(phrase)
    if (i >= 0 && (!best || i < best.i)) best = { i, phrase, why }
  }
  if (!best) return
  const end = best.i + best.phrase.length
  const rest = node.splitText(end)
  if (rest.nodeValue === '' && rest.nextSibling?.classList?.contains('tc')) return // already marked
  const tag = document.createElement('span')
  tag.className = 'tc'
  tag.textContent = 'to confirm'
  tag.title = best.why
  tag.setAttribute('aria-label', `to confirm: ${best.why}`)
  node.parentNode.insertBefore(tag, rest)
  markText(rest) // more claims later in the same text
}

function markAll(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: n => n.parentElement?.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  })
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  for (const n of nodes) {
    if (n.nextSibling?.classList?.contains('tc')) continue
    markText(n)
  }
}

export function startClaimMarkers() {
  markAll(document.body)
  // after that, only re-mark what changed (tabs, sliders, the rotor every 2.2 s), not the page
  let busy = false
  const pending = new Set()
  const flush = () => {
    busy = true
    for (const n of pending) if (n.isConnected) n.nodeType === Node.TEXT_NODE ? n.parentElement && markAll(n.parentElement) : markAll(n)
    pending.clear()
    busy = false
  }
  new MutationObserver(list => {
    if (busy) return
    const first = pending.size === 0
    for (const m of list) for (const n of m.addedNodes) if (!n.classList?.contains('tc')) pending.add(n)
    if (first && pending.size) requestAnimationFrame(flush)
  }).observe(document.body, { childList: true, subtree: true })
}
