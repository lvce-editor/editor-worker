import { join } from 'node:path'
import { root } from './root.ts'

export const threshold = 730_000

export const workerPath = join(root, '.tmp/dist/dist/editorWorkerMain.js')