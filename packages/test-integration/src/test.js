import { readdir } from 'fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'url'

const uri = '../../test-integration-util/src/setup.js'

const module = await import(uri)

const { setup } = module

const __dirname = dirname(fileURLToPath(import.meta.url))

const only = [
  // 'editor-completion-focus-previous.test.js'
]

const skip = [
  'editor.close-rename.test.js',
  'editor.open-rename.test.js',
  'find-widget.test.js',
  'editor-completion-details-close.test.js',
  'editor-completion-details.test.js',
  'editor-find-focus-next.test.js',
  'editor-find-focus-previous.test.js',
  'editor-completion-focus-first.test.js',
  'editor-completion-focus-next.test.js',
  'editor-completion-focus-previous.test.js',
  'editor-fund-handle-input.test.js',
]

const runTests = async (dirents) => {
  for (const dirent of dirents) {
    if (only.length > 0 && !only.includes(dirent)) {
      continue
    }
    if (skip.includes(dirent)) {
      continue
    }
    try {
      const absolutePath = join(__dirname, dirent)
      const absoluteUri = pathToFileURL(absolutePath).toString()
      const module = await import(absoluteUri)
      if (module.skip) {
        continue
      }
      const rpc = await setup()
      await module.test(rpc)
    } catch (error) {
      console.error(`test failed ${dirent}: ${error}`)
      process.exitCode = 1
    }
  }
}

const isTest = (dirent) => {
  return dirent.endsWith('.test.js')
}

const main = async () => {
  const dirents = await readdir(__dirname)
  const filteredDirents = dirents.filter(isTest)
  await runTests(filteredDirents)
  process.exit()
}

main()
