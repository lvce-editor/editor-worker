import assert from 'node:assert/strict'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const owner = dirname(fileURLToPath(import.meta.url))
assert.ok(process.argv[2], 'Pass an application checkout')
const application = resolve(process.argv[2])
const manifest = JSON.parse(await readFile(join(application, 'package.json'), 'utf8'))
assert.equal(manifest.name, 'lvce-editor')
const testRoot = join(application, 'packages/extension-host-worker-tests')
const scenario = join(testRoot, 'src/viewlet.editor-direct-events.js')
const fixture = join(testRoot, 'fixtures/viewlet.editor-direct-events')
const index = join(application, 'static/index.html')
const backup = join(application, '.tmp/direct-editor-test-index.html')

if (process.argv.includes('--clean')) {
  try {
    await writeFile(index, await readFile(backup))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  await rm(backup, { force: true })
  await rm(scenario, { force: true })
  await rm(fixture, { force: true, recursive: true })
} else {
  const original = await readFile(index, 'utf8')
  await mkdir(join(application, '.tmp'), { recursive: true })
  await writeFile(backup, original, { flag: 'wx' })
  const configPattern = /(<script\b[^>]*\bid=["']Config["'][^>]*>)([\s\S]*?)(<\/script>)/i
  const match = original.match(configPattern)
  assert.ok(match, 'Application runtime configuration missing')
  const config = JSON.parse(match[2])
  config.platform = 'remote'
  await writeFile(
    index,
    original.replace(configPattern, (_match, start, _config, end) => `${start}${JSON.stringify(config)}${end}`),
  )
  const source = await readFile(join(owner, 'src/viewlet.editor-direct-events.ts'), 'utf8')
  await writeFile(scenario, stripTypeScriptTypes(source), { flag: 'wx' })
  await cp(join(owner, 'fixtures/viewlet.editor-direct-events'), fixture, { recursive: true, errorOnExist: true, force: false })
}
