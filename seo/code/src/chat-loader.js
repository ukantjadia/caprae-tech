// Start the site assistant (src/chat.js) once the page has loaded and the browser is idle, so the
// widget's script and styles never compete with the content, the fonts or the particle stage.
export function loadChat() {
  const go = () => import('./chat.js').then(m => m.startChat())
  const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 3000 }) : setTimeout(go, 1500))
  if (document.readyState === 'complete') idle()
  else addEventListener('load', idle, { once: true })
}
