import { cp, readFile, readdir, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'

if (!process.argv[2]) throw new Error('Pass the path to a disposable LVCE checkout')

const application = resolve(process.argv[2])
const distribution = join(application, 'packages/build/.tmp/dist')
const entries = await readdir(distribution, { withFileTypes: true })
const settingsDirectories = entries.filter((entry) => entry.isDirectory()).map((entry) => join(distribution, entry.name, 'builtin-settings'))
const existingDirectories = []
for (const path of settingsDirectories) {
  try {
    await readdir(path)
    existingDirectories.push(path)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
}
if (existingDirectories.length !== 1) {
  throw new Error(`Expected one built-in settings bundle, found ${existingDirectories.length}`)
}

const source = existingDirectories[0]
const index = JSON.parse(await readFile(join(source, 'index.json'), 'utf8'))
if (!index.includes('editor-worker.json')) {
  throw new Error('Built-in settings bundle does not contain editor-worker settings')
}
const target = join(application, 'packages/renderer-worker/node_modules/builtin-settings')
await rm(target, { recursive: true, force: true })
await cp(source, target, { recursive: true })
