// Draft C. The page itself is the Section Lab, ported by `bun run port` (index.html).
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '../../dala-lab-engine/engine.css'
import * as shapes from './config.js'
import EXTENTS from './extents.json'
import { startStage } from '../../dala-lab-engine/stage.js'
import { startClaimMarkers } from '../../dala-lab-engine/claims.js'
import { applyA11yFixes } from '../../dala-lab-engine/a11y.js'

applyA11yFixes()
startClaimMarkers()
startStage({ ...shapes, EXTENTS })
