import { access, cp, mkdir, readdir, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

if (!process.argv[2]) {
  throw new Error('Pass the path to a disposable LVCE checkout')
}

const application = resolve(process.argv[2])
const distPath = join(application, 'packages/build/.tmp/dist')
const target = join(application, 'packages/renderer-worker/node_modules/builtin-settings')
let copiedBuiltinSettings = false

for (const entry of await readdir(distPath, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    continue
  }
  const source = join(distPath, entry.name, 'builtin-settings')
  try {
    await access(source)
  } catch (error) {
    if (error.code === 'ENOENT') {
      continue
    }
    throw error
  }
  await rm(target, { recursive: true, force: true })
  await mkdir(dirname(target), { recursive: true })
  await cp(source, target, { recursive: true })
  copiedBuiltinSettings = true
  break
}

if (!copiedBuiltinSettings) {
  throw new Error('Build application static assets before copying built-in settings')
}
