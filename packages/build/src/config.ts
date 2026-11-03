import { join } from 'node:path'
import { root } from './root.ts'

// Registering Editor.unindent adds 384 bytes; retain 1,000 bytes of measured headroom.
// Optional syntax cache metadata adds 8,060 bytes over the startup baseline.
// Application-scoped conditional edits: baseline 1,180,880; candidate 1,181,724 (+844 bytes).
// Keep 1,000 bytes of headroom for the candidate.
export const threshold = 1_182_724

export const workerPath = join(root, '.tmp/dist/dist/editorWorkerMain.js')

export const minifiedWorkerPath = join(root, '.tmp/dist/dist/editorWorkerMain.min.js')

export const playwrightPath = import.meta.resolve('playwright')
