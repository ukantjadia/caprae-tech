// Home page: final-draft-2 unchanged (its index.html, styles and particle stage), with the site's
// shared navbar and footer in place of the draft's own. Same imports as the draft's main.js.
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import './engine/engine.css'
import './engine/final.css'
import './style.css'
import './chrome.css'
import * as shapes from './config.js'
import EXTENTS from './extents.json'
import { applyA11yFixes } from './engine/a11y.js'
import { startFinalPage } from './engine/final-page.js'
import { startMenu } from './menu.js'
import './home-links.js'
import { loadChat } from './chat-loader.js'

applyA11yFixes()
startFinalPage()
startMenu()
// the particle stage after the first paint: building it is a ~2s main-thread task, and before this
// nothing (not the loader, not the hero) could paint until it had finished (D-118). The engine is
// fetched only then too, so the menu and links don't wait for its 168 KB download (D-100)
requestAnimationFrame(() => setTimeout(() => import('./engine/stage.js').then(m => m.startStage({ ...shapes, EXTENTS, POSTER: `${import.meta.env.BASE_URL}posters/home.webp` }))))
// the site assistant's chat icon, once the page has loaded
loadChat()
