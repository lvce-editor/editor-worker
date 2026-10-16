import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

if (!process.argv[2]) throw new Error('Pass the path to a disposable LVCE checkout')

const application = resolve(process.argv[2])
const path = join(application, 'static/index.html')
const html = await readFile(path, 'utf8')
const configPattern = /(<script\b[^>]*\bid=["']Config["'][^>]*>)([\s\S]*?)(<\/script>)/i
const match = html.match(configPattern)
if (!match) throw new Error('Expected an application runtime configuration')
const config = JSON.parse(match[2])
// These scenarios run against the Node source server, including its extension
// language configurations. Static-web mode uses a different asset/runtime path.
config.platform = 'remote'
await writeFile(
  path,
  html.replace(configPattern, (_match, opening, _config, closing) => `${opening}${JSON.stringify(config)}${closing}`),
)
