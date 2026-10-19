// Home page: final-draft-2 unchanged (its index.html, styles and particle stage), with the site's
// shared navbar and footer in place of the draft's own. Same imports as the draft's main.js.
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './engine/engine.css'
import './engine/final.css'
import './style.css'
import './chrome.css'
import * as shapes from './config.js'
import EXTENTS from './extents.json'
import { startStage } from './engine/stage.js'
import { applyA11yFixes } from './engine/a11y.js'
import { startFinalPage } from './engine/final-page.js'
import { startMenu } from './menu.js'
import './home-links.js'

applyA11yFixes()
startFinalPage()
startMenu()
startStage({ ...shapes, EXTENTS })
