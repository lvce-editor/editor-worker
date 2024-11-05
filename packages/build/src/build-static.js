import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.js'
import { cp } from 'node:fs/promises'

const sharedProcessPath = join(root, 'packages', 'server', 'node_modules', '@lvce-editor', 'shared-process', 'index.js')

const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()

const sharedProcess = await import(sharedProcessUrl)

const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  pathPrefix: '/editor-worker',
})

await cp(
  join(root, '.tmp', 'dist', 'dist', 'editorWorkerMain.js'),
  join(root, 'dist', commitHash, 'packages', 'editor-worker', 'dist', 'editorWorkerMain.js')
)

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
