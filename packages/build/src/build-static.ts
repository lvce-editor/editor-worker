import { cp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.ts'

const sharedProcessPath = join(root, 'packages', 'server', 'node_modules', '@lvce-editor', 'shared-process', 'index.js')

const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()

const sharedProcess = await import(sharedProcessUrl)

process.env.PATH_PREFIX = '/editor-worker'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

await cp(
  join(root, '.tmp', 'dist', 'dist', 'editorWorkerMain.js'),
  join(root, 'dist', commitHash, 'packages', 'editor-worker', 'dist', 'editorWorkerMain.js'),
)

const rendererWorkerPath = join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')

export const getRemoteUrl = (path: string): string => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const content = await readFile(rendererWorkerPath, 'utf8')
const workerPath = join(root, '.tmp/dist/dist/editorWorkerMain.js')
const remoteUrl = getRemoteUrl(workerPath)

if (content.includes('// const editorWorkerUrl = ')) {
  const occurrence = `// const editorWorkerUrl = \`\${assetDir}/packages/editor-worker/dist/editorWorkerMain.js\`
const editorWorkerUrl = \`${remoteUrl}\``
  const replacement = `const editorWorkerUrl = \`\${assetDir}/packages/editor-worker/dist/editorWorkerMain.js\``
  const newContent = content.replace(occurrence, replacement)
  await writeFile(rendererWorkerPath, newContent)
}

const rendererProcessPath = join(root, 'dist', commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js')

const replace = async ({ uri, occurrence, replacement }) => {
  const content = await readFile(uri, 'utf8')
  const newContent = content.replace(occurrence, replacement)
  await writeFile(uri, newContent)
}

await replace({
  uri: rendererProcessPath,
  occurrence: `const editorWorkerUrl = \`${remoteUrl}\``,
  replacement: 'const editorWorkerUrl = `${assetDir}/packages/editor-worker/dist/editorWorkerMain.js`',
})

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
