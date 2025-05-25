import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..', '..', '..')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const nodeModulesPath = join(root, 'packages', 'server', 'node_modules')

const editorWorkerPath = join(root, 'dist', 'dist', 'editorWorkerMain.js')

const staticPath = join(nodeModulesPath, '@lvce-editor', 'static-server', 'static')
const indexHtmlPath = join(staticPath, 'index.html')

const indexHtmlContent = await readFile(indexHtmlPath, 'utf8')

const remoteUrl = getRemoteUrl(editorWorkerPath)

const config = {
  'develop.editorWorkerPath': remoteUrl,
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
const commitHash = folders.find((item) => item.isDirectory())?.name || ''
const rendererProcessPath = join(staticPath, commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js')

await replace({
  uri: rendererProcessPath,
  occurrence: 'const editorWorkerUrl = `${assetDir}/packages/editor-worker/dist/editorWorkerMain.js`',
  replacement: `const editorWorkerUrl = \`${remoteUrl}\``,
})
