import { readdir } from 'fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'url'
import { setup } from '../test-integration-util/setup.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const runTests = async (dirents) => {
  for (const dirent of dirents) {
    const absolutePath = join(__dirname, dirent)
    const absoluteUri = pathToFileURL(absolutePath).toString()
    const module = await import(absoluteUri)
    const rpc = await setup()
    await module.test(rpc)
  }
}

const isTest = (dirent) => {
  return dirent.endsWith('.test.js')
}

const main = async () => {
  const dirents = await readdir(__dirname)
  const filteredDirents = dirents.filter(isTest)
  await runTests(filteredDirents)
  process.exit(0)
}

main()
