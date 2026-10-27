import { join } from 'node:path'
import { root } from './root.ts'

// Optional syntax cache metadata adds 8,060 bytes over the startup baseline.
export const threshold = 1_180_000

export const workerPath = join(root, '.tmp/dist/dist/editorWorkerMain.js')

export const minifiedWorkerPath = join(root, '.tmp/dist/dist/editorWorkerMain.min.js')

export const playwrightPath = import.meta.resolve('playwright')
