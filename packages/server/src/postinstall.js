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

const patchRendererProcess = (content) => {
  if (content.includes("'DragAndDrop.handleMessagePort': handleDragAndDropMessagePort")) {
    return content
  }
  const createWorkerWithPort = content.match(
    /const (create\$\w+) = async \(\{\n  commandMap,\n  name,\n  port,\n  url\n\}\) => \{[\s\S]*?await workerRpc\.invokeAndTransfer\('initialize', 'message-port', port\);/,
  )?.[1]
  const createMessagePortRpc = content.match(
    /const (create\$\w+) = async \(\{\n  commandMap,\n  isMessagePortOpen = true,\n  messagePort\n\}\) => \{/,
  )?.[1]
  if (!createWorkerWithPort || !createMessagePortRpc) {
    throw new Error('renderer process drag-and-drop dependencies not found')
  }
  const implementation = `const dragAndDropWorkerUrlForTests = \`\${assetDir}/packages/drag-and-drop-worker/dist/dragAndDropWorkerMain.js\`;
let dragAndDropWorkerRpcForTests;
const handleDragAndDropMessagePort = async port => {
  if (!dragAndDropWorkerRpcForTests) {
    const { port1, port2 } = new MessageChannel();
    await ${createWorkerWithPort}({ commandMap: {}, name: 'Drag And Drop Worker', port: port1, url: dragAndDropWorkerUrlForTests });
    dragAndDropWorkerRpcForTests = await ${createMessagePortRpc}({ commandMap: commandMapRef, messagePort: port2 });
  }
  await dragAndDropWorkerRpcForTests.invokeAndTransfer('DragAndDrop.handleMessagePort', port);
};

`
  return content
    .replace('const commandMap = {', implementation + 'const commandMap = {')
    .replace("  'DropData.get':", "  'DragAndDrop.handleMessagePort': handleDragAndDropMessagePort,\n  'DropData.get':")
}

const patchRendererWorker = (content) => {
  const dragAndDropCommand = "'SendMessagePortToExtensionHostWorker.sendMessagePortToDragAndDropWorker'"
  const dragAndDropExport = '  sendMessagePortToDragAndDropWorker: sendMessagePortToRendererProcess,'
  if (content.includes(dragAndDropExport)) {
    return content
  }
  const rendererProcessCommand =
    "  'SendMessagePortToExtensionHostWorker.sendMessagePortToRendererProcess': lazy('SendMessagePortToExtensionHostWorker.sendMessagePortToRendererProcess'),"
  const rendererProcessExport = '  sendMessagePortToRendererProcess: sendMessagePortToRendererProcess,'
  if (!content.includes(rendererProcessCommand)) {
    throw new Error('renderer worker renderer-process bridge not found')
  }
  if (!content.includes(rendererProcessExport)) {
    throw new Error('renderer worker renderer-process export not found')
  }
  const dragAndDropCommandEntry = `  ${dragAndDropCommand}: lazy('SendMessagePortToExtensionHostWorker.sendMessagePortToDragAndDropWorker'),`
  const contentWithCommand = content.includes(dragAndDropCommand)
    ? content.replace(
        `  ${dragAndDropCommand}: lazy('SendMessagePortToExtensionHostWorker.sendMessagePortToRendererProcess'),`,
        dragAndDropCommandEntry,
      )
    : content.replace(rendererProcessCommand, `${dragAndDropCommandEntry}\n${rendererProcessCommand}`)
  return contentWithCommand.replace(rendererProcessExport, `${dragAndDropExport}\n${rendererProcessExport}`)
}

const remoteUrl = getRemoteUrl(editorWorkerPath)
const folders = await readdir(staticPath, { withFileTypes: true })
const commitHash = folders.find((item) => item.isDirectory() && item.name !== 'auth')?.name || ''

const config = {
  'develop.editorWorkerPath': remoteUrl,
  'developer.editorWorkerPath': remoteUrl,
  editorWorkerUrl: remoteUrl,
  rendererWorkerUrl: `/${commitHash}/packages/renderer-worker/dist/rendererWorkerMain.js?v=drag-and-drop`,
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

const rendererProcessPath = join(staticPath, commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js')
const rendererWorkerPath = join(staticPath, commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')
const renameWorkerPath = join(staticPath, commitHash, 'packages', 'rename-worker', 'dist', 'renameWorkerMain.js')
const dragAndDropWorkerPath = join(staticPath, commitHash, 'packages', 'drag-and-drop-worker', 'dist', 'dragAndDropWorkerMain.js')

await cp(fileURLToPath(import.meta.resolve('@lvce-editor/rename-worker')), renameWorkerPath)
await cp(fileURLToPath(import.meta.resolve('@lvce-editor/drag-and-drop-worker')), dragAndDropWorkerPath)

const rendererProcess = await readFile(rendererProcessPath, 'utf8')
await writeFile(rendererProcessPath, patchRendererProcess(rendererProcess))

await replace({
  uri: rendererProcessPath,
  occurrence: '`${assetDir}/packages/renderer-worker/dist/rendererWorkerMain.js`',
  replacement: '`${assetDir}/packages/renderer-worker/dist/rendererWorkerMain.js?v=drag-and-drop`',
})

const rendererWorker = await readFile(rendererWorkerPath, 'utf8')
await writeFile(rendererWorkerPath, patchRendererWorker(rendererWorker))

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
