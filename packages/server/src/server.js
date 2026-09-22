import { fileURLToPath } from 'node:url'

process.argv.push('--link', fileURLToPath(new URL('../../../.tmp/dist', import.meta.url)))
process.env.LVCE_STATIC_ROOT = fileURLToPath(new URL('../../../.tmp/static', import.meta.url))

await import('@lvce-editor/server/bin/server.js')
