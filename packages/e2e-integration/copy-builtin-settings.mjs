import { cp, readFile, readdir, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

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

// Rebundle after copying static assets: the source server needs settings from the overlaid worker.
process.chdir(application)
const workers = JSON.parse(await readFile(join(application, 'packages/renderer-worker/src/parts/Workers/Workers.json'), 'utf8'))
const { bundleBuiltinSettings } = await import(
  pathToFileURL(join(application, 'packages/build/src/parts/BundleBuiltinSettings/BundleBuiltinSettings.ts'))
)
await bundleBuiltinSettings({
  toRoot: 'packages/renderer-worker/node_modules',
  workers,
})
const bundledSettings = JSON.parse(await readFile(join(target, 'editor-worker.json'), 'utf8'))
if (!bundledSettings.some((setting) => setting.id === 'editor.tabCompletion')) {
  throw new Error('Tab Completion setting was not bundled for the source server')
}
