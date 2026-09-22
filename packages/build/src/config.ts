import { join } from 'node:path'
import { root } from './root.ts'

export const threshold = 1_100_200

export const workerPath = join(root, '.tmp/dist/dist/editorWorkerMain.js')

export const minifiedWorkerPath = join(root, '.tmp/dist/dist/editorWorkerMain.min.js')

export const playwrightPath = import.meta.resolve('playwright')
