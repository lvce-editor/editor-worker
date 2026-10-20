import assert from 'node:assert/strict'
import { readFile, rm, writeFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

assert.ok(process.argv[2], 'Pass an application checkout')
const application = resolve(process.argv[2])
const manifest = JSON.parse(await readFile(join(application, 'package.json'), 'utf8'))
assert.equal(manifest.name, 'lvce-editor')
const target = join(application, 'packages/extension-host-worker-tests/src/editor.toggle-comment-html.js')
if (process.argv.includes('--clean')) {
  await rm(target, { force: true })
} else {
  const owner = dirname(fileURLToPath(import.meta.url))
  const source = await readFile(join(owner, 'src/editor.toggle-comment-html.ts'), 'utf8')
  await writeFile(target, stripTypeScriptTypes(source), { flag: 'wx' })
}
