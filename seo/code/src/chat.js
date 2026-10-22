// Caprae Tech site assistant widget: a round chat icon that opens the assistant.
// Same behaviour as the Caprae Capital widget (capraecapital-site/site/assets/chat/chat.js):
// replies are always inserted as plain text; long ones are shortened with a "Know more" toggle;
// the one matching page (our own pages only) gets an "Open … page" link under the answer;
// the conversation is kept across pages for the visit (sessionStorage); full screen on phones.
// The API is chatbot/app.py behind nginx at /api/chat. Loaded after the page (home.js, inner.js).
import './chat.css'

const API = '/api/chat'
const SITEKEY = ''                          // Cloudflare Turnstile site key; empty = off (as on Caprae Capital)
const BASE = import.meta.env.BASE_URL       // '/' on capraetech.io, '/caprae-tech/' on GitHub Pages
const MAX = 600
const SHORT_WORDS = 60                      // longer answers show this many words, then "Know more"
const STORE = 'ct-chat-v1'
const SITE = 'https://capraetech.io'
const ALLOWED = [SITE + '/', 'https://capraecapital.com', 'https://coldcallkillers.io', 'https://bankersedgeadvisory.com',
  'https://simbastud.io', 'https://www.linkedin.com/in/kevinhshong', 'mailto:partners@capraecapital.com']
const SUGGESTIONS = ['What do you build?', 'How does pricing work?', 'Do I need to be technical?', 'How do I get started?']

export function startChat() {
  if (window.__ctChat) return
  window.__ctChat = true

  let state = { sessionId: null, transcript: [], turnstileToken: null, busy: false }
  try { const saved = JSON.parse(sessionStorage.getItem(STORE) || 'null'); if (saved) state = Object.assign(state, saved) } catch (e) {}
  function save() {
    try { sessionStorage.setItem(STORE, JSON.stringify({ sessionId: state.sessionId, transcript: state.transcript.slice(-40) })) } catch (e) {}
  }

  function el(tag, attrs, children) {
    const n = document.createElement(tag)
    for (const k in attrs || {}) {
      if (k === 'text') n.textContent = attrs[k]
      else if (k === 'on') for (const ev in attrs.on) n.addEventListener(ev, attrs.on[ev])
      else n.setAttribute(k, attrs[k])
    }
    ;(children || []).forEach(c => n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c))
    return n
  }

  // A safe href, or null. Our own pages become paths on the current site (with its base path).
  function allowedHref(href) {
    if (href.charAt(0) === '/' && href.charAt(1) !== '/') href = SITE + href
    for (const a of ALLOWED) {
      if (href === a || href.indexOf(a) === 0) {
        return href.indexOf(SITE + '/') === 0 ? BASE + href.slice(SITE.length + 1) : href
      }
    }
    return null
  }

  // The first ~SHORT_WORDS words, ending on a sentence where possible, or null if the text is short.
  function shortVersion(text) {
    const re = /\S+/g
    let n = 0, m, endAt = -1
    while ((m = re.exec(text))) { if (++n === SHORT_WORDS) endAt = m.index + m[0].length }
    if (n <= SHORT_WORDS + 15) return null                 // not worth hiding just a few words
    let cut = text.slice(0, endAt)
    const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('\n'))
    if (stop > cut.length / 2) cut = cut.slice(0, stop + 1)
    return cut.replace(/[\s,;:.]+$/, '') + '…'
  }

  let launch, panel, log, input, send, tsBox

  function build() {
    launch = el('button', { type: 'button', class: 'ct-launch', 'aria-haspopup': 'dialog', 'aria-expanded': 'false',
      'aria-controls': 'ct-panel', 'aria-label': 'Ask Caprae Tech', title: 'Ask Caprae Tech', on: { click: open } })
    launch.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
      '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-5 4V5.5z" stroke-linejoin="round"/>' +
      '<path d="M8.5 9.5h7M8.5 12.5h4" stroke-linecap="round"/></svg>'

    log = el('div', { class: 'ct-log', role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions' })
    input = el('textarea', { class: 'ct-input', rows: '1', maxlength: String(MAX), id: 'ct-input',
      placeholder: 'Type your question…', 'aria-label': 'Your question',
      on: { keydown: onKey, input: onInput } })
    send = el('button', { type: 'submit', class: 'ct-send', 'aria-label': 'Send' })
    send.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    tsBox = el('div', { class: 'ct-turnstile' })

    panel = el('div', { class: 'ct-panel', id: 'ct-panel', role: 'dialog', 'aria-modal': 'false',
      'aria-labelledby': 'ct-title', hidden: '' }, [
      el('div', { class: 'ct-head' }, [
        el('div', {}, [
          el('h2', { class: 'ct-title', id: 'ct-title', text: 'Ask Caprae Tech' }),
          el('p', { class: 'ct-sub', text: 'Answers from our website. A founder is one call away.' })]),
        el('button', { type: 'button', class: 'ct-close', 'aria-label': 'Close chat', text: '×', on: { click: close } })]),
      log,
      tsBox,
      el('form', { class: 'ct-form', on: { submit: onSubmit } }, [el('label', { class: 'ct-sr', for: 'ct-input', text: 'Your question' }), input, send]),
    ])

    const root = el('div', { class: 'ct-chat' }, [launch, panel])
    document.body.appendChild(root)
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close() })

    if (state.transcript.length) state.transcript.forEach(m => render(m, false))
    else welcome()
  }

  function welcome() {
    const m = el('div', { class: 'ct-msg ct-bot' })
    m.textContent = 'Hi! I can answer questions about Caprae Tech: what we build, who we build for, pricing, process and team.'
    log.appendChild(m)
    const chips = el('div', { class: 'ct-chips', 'data-chips': '' })
    SUGGESTIONS.forEach(q => chips.appendChild(el('button', { type: 'button', class: 'ct-chip', text: q, on: { click: () => ask(q) } })))
    log.appendChild(chips)
  }

  function render(m, persist) {
    const node = el('div', { class: 'ct-msg ' + (m.role === 'user' ? 'ct-user' : 'ct-bot') })
    if (m.role === 'user') node.textContent = m.text
    else {
      const body = el('div', { class: 'ct-text' }), short = shortVersion(m.text)
      body.textContent = short || m.text
      node.appendChild(body)
      const actions = el('div', { class: 'ct-actions' })
      if (short) {
        const more = el('button', { type: 'button', class: 'ct-more', text: 'Know more', 'aria-expanded': 'false',
          on: { click: () => {
            const full = more.getAttribute('aria-expanded') === 'false'
            body.textContent = full ? m.text : short
            more.textContent = full ? 'Show less' : 'Know more'
            more.setAttribute('aria-expanded', String(full))
          } } })
        actions.appendChild(more)
      }
      const src = (m.sources || [])[0], href = src && allowedHref(src.url || '')
      if (href) actions.appendChild(el('a', { class: 'ct-page', href, text: 'Open ' + (src.title || 'this') + ' page →' }))
      if (actions.childNodes.length) node.appendChild(actions)
    }
    log.appendChild(node)
    log.scrollTop = log.scrollHeight
    if (persist) { state.transcript.push(m); save() }
  }

  function open() {
    panel.hidden = false; launch.hidden = true; launch.setAttribute('aria-expanded', 'true')
    document.documentElement.classList.add('ct-open')
    loadTurnstile()
    setTimeout(() => { input.focus(); log.scrollTop = log.scrollHeight }, 30)
  }
  function close() {
    panel.hidden = true; launch.hidden = false; launch.setAttribute('aria-expanded', 'false'); launch.focus()
    document.documentElement.classList.remove('ct-open')
  }

  function onInput() {
    // Grow with the text; only show a scrollbar once the box reaches its maximum height.
    input.style.height = 'auto'
    const full = input.scrollHeight + 2                     // + top/bottom border
    input.style.height = Math.min(full, 120) + 'px'
    input.style.overflowY = full > 120 ? 'auto' : 'hidden'
  }
  function onKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(e) } }
  function onSubmit(e) { e.preventDefault(); ask(input.value) }

  function ask(text) {
    text = (text || '').trim()
    if (!text || state.busy) return
    if (text.length > MAX) text = text.slice(0, MAX)
    const chips = log.querySelector('[data-chips]'); if (chips) chips.remove()
    if (SITEKEY && !state.sessionId && !state.turnstileToken) {
      render({ role: 'bot', text: 'Please complete the quick check below, then send your question again.' }, false)
      return
    }
    render({ role: 'user', text }, true)
    input.value = ''; onInput()
    state.busy = true; send.disabled = true
    const typing = el('div', { class: 'ct-msg ct-bot', 'aria-label': 'Assistant is typing' },
      [el('span', { class: 'ct-typing' }, [el('span'), el('span'), el('span')])])
    log.appendChild(typing); log.scrollTop = log.scrollHeight

    fetch(API, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit',
      body: JSON.stringify({ session_id: state.sessionId, message: text, turnstile_token: state.turnstileToken }),
    }).then(r => r.json().catch(() => ({})))
      .then(data => {
        if (data.session_id) state.sessionId = data.session_id
        render({ role: 'bot', text: data.reply || 'Sorry, something went wrong. Please try again.', sources: data.sources || [] }, true)
      })
      .catch(() => {
        render({ role: 'bot', text: 'Sorry, I can’t connect right now. Please email partners@capraecapital.com.' }, false)
      })
      .then(() => { typing.remove(); state.busy = false; send.disabled = false; input.focus() })
  }

  // Optional Cloudflare Turnstile (bot check on the first message).
  let tsLoaded = false
  function loadTurnstile() {
    if (!SITEKEY || tsLoaded || state.sessionId) return
    tsLoaded = true
    window.ctTurnstileReady = () => {
      window.turnstile.render(tsBox, { sitekey: SITEKEY, theme: 'dark', size: 'flexible',
        callback: t => { state.turnstileToken = t } })
    }
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=ctTurnstileReady'
    s.async = true; document.head.appendChild(s)
  }

  build()
}
