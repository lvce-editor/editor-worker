import { fileURLToPath } from 'node:url'

process.argv.push('--link', fileURLToPath(new URL('../../../.tmp/dist', import.meta.url)))

await import('@lvce-editor/server/bin/server.js')
