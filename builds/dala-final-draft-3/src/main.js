// Final draft 3: the Section Lab with the user's picks (cbaabacccb) and the content changes
// (D-080), ported by `bun run port` (index.html). Draft C's shapes; particles dim under text (D-079).
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '../../dala-lab-engine/engine.css'
import '../../dala-lab-engine/final.css'
import './style.css'
import * as shapes from './config.js'
import EXTENTS from './extents.json'
import { startStage } from '../../dala-lab-engine/stage.js'
import { applyA11yFixes } from '../../dala-lab-engine/a11y.js'
import { startFinalPage } from '../../dala-lab-engine/final-page.js'

applyA11yFixes()
startFinalPage()
startStage({ ...shapes, EXTENTS })
