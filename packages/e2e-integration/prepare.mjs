import { cp, mkdir, readdir, readFile, realpath, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const owner = resolve(here, '../..')
if (!process.argv[2]) throw new Error('Pass the path to a disposable LVCE checkout')
const application = resolve(process.argv[2])
const manifest = JSON.parse(await readFile(join(application, 'package.json'), 'utf8'))
if (manifest.name !== 'lvce-editor') throw new Error('Expected an LVCE application checkout')
const config = JSON.parse(await readFile(join(here, 'config.json'), 'utf8'))
const tests = join(application, 'packages/extension-host-worker-tests')
// Keep the application's runner and replace only its test inventory.
for (const name of await readdir(join(tests, 'src'))) {
  if (name !== '_all.js') await rm(join(tests, 'src', name), { recursive: true })
}
await cp(join(here, 'src'), join(tests, 'src'), { recursive: true })
await rm(join(tests, 'fixtures'), { recursive: true, force: true })
await mkdir(join(tests, 'fixtures'), { recursive: true })
try {
  await cp(join(here, 'fixtures'), join(tests, 'fixtures'), { recursive: true })
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}
for (const path of config.scripts) {
  await cp(join(here, 'scripts', path.split('/').at(-1)), join(application, path))
}
// Exercise this repository's build in the pinned application runtime.
for (const [from, to] of config.artifacts) {
  const target = await realpath(join(application, to)).catch((error) => {
    if (error.code !== 'ENOENT') throw error
    return join(application, to)
  })
  await cp(join(owner, from), target, { recursive: true })
}

// Build the built-in settings index from the overlaid worker settings, as the application build does.
process.chdir(application)
const workers = JSON.parse(await readFile(join(application, 'packages/renderer-worker/src/parts/Workers/Workers.json'), 'utf8'))
const { bundleBuiltinSettings } = await import(
  pathToFileURL(join(application, 'packages/build/src/parts/BundleBuiltinSettings/BundleBuiltinSettings.ts'))
)
await bundleBuiltinSettings({
  toRoot: 'packages/renderer-worker/node_modules',
  workers,
})
const builtinSettings = join(application, 'packages/renderer-worker/node_modules/builtin-settings')
const settingsFiles = JSON.parse(await readFile(join(builtinSettings, 'index.json'), 'utf8'))
if (!settingsFiles.includes('editor-worker.json')) throw new Error('Built-in editor worker settings were not bundled')
const editorSettings = JSON.parse(await readFile(join(builtinSettings, 'editor-worker.json'), 'utf8'))
if (!editorSettings.some((setting) => setting.id === 'editor.tabCompletion')) throw new Error('Tab Completion setting was not bundled')
