import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.js'
import { cp } from 'node:fs/promises'

const sharedProcessPath = join(root, 'packages', 'server', 'node_modules', '@lvce-editor', 'shared-process', 'index.js')

const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()

const sharedProcess = await import(sharedProcessUrl)
console.log({ sharedProcess })

const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
})

console.log({ commitHash })

await cp(join(root, 'dist', 'dist', 'editorWorkerMain.js'), join(root, ''))
