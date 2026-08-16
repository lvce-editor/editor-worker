import { join } from 'node:path'
import { root } from './root.ts'

export const threshold = 906_000

export const workerPath = join(root, '.tmp/dist/dist/editorWorkerMain.js')

export const minifiedWorkerPath = join(root, '.tmp/dist/dist/editorWorkerMain.min.js')

export const playwrightPath = new URL('../../../node_modules/playwright/index.mjs', import.meta.url).href
