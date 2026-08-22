import { cp, readdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..', '..', '..')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const editorWorkerPath = join(root, '.tmp', 'dist', 'dist', 'editorWorkerMain.js')

const serverPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/server/package.json'))
const requireFromServer = createRequire(serverPackagePath)
const staticServerPackagePath = requireFromServer.resolve('@lvce-editor/static-server/package.json')
const staticPath = join(dirname(staticServerPackagePath), 'static')
const indexHtmlPath = join(staticPath, 'index.html')

const remoteUrl = getRemoteUrl(editorWorkerPath)

const config = {
  'develop.editorWorkerPath': remoteUrl,
  'developer.editorWorkerPath': remoteUrl,
  editorWorkerUrl: remoteUrl,
}
const stringifiedConfig = JSON.stringify(config, null, 2)

const replace = async ({ uri, occurrence, replacement }) => {
  const content = await readFile(uri, 'utf8')
  const newContent = content.replace(occurrence, replacement)
  await writeFile(uri, newContent)
}

await replace({
  uri: indexHtmlPath,
  occurrence: '</title>',
  replacement: `</title>
 <script type="application/json" id="Config">${stringifiedConfig}</script>`,
})

const folders = await readdir(staticPath, { withFileTypes: true })
const commitHash = folders.find((item) => item.isDirectory() && item.name !== 'auth')?.name || ''
const rendererProcessPath = join(staticPath, commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js')
const rendererWorkerPath = join(staticPath, commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')
const renameWorkerPath = join(staticPath, commitHash, 'packages', 'rename-worker', 'dist', 'renameWorkerMain.js')

await cp(fileURLToPath(import.meta.resolve('@lvce-editor/rename-worker')), renameWorkerPath)

await replace({
  uri: rendererProcessPath,
  occurrence: '`${assetDir}/packages/editor-worker/dist/editorWorkerMain.js`',
  replacement: `\`${remoteUrl}\``,
})

await replace({
  uri: rendererWorkerPath,
  occurrence: '`${assetDir}/packages/editor-worker/dist/editorWorkerMain.js`',
  replacement: `\`${remoteUrl}\``,
})

await replace({
  uri: rendererWorkerPath,
  occurrence: '`${assetDir}/packages/rename-worker/dist/renameWorkerMain.js`',
  replacement: '`${assetDir}/packages/rename-worker/dist/renameWorkerMain.js?v=1.36.0`',
})
