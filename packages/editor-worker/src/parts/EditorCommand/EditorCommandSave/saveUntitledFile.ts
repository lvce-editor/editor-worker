import { RendererWorker } from '@lvce-editor/rpc-registry'

export const saveUntitledFile = async (uri: string, content: string) => {
  const [filePath] = await RendererWorker.invoke('ElectronDialog.showOpenDialog', 'Save File', ['openFile', 'dontAddToRecent', 'showHiddenFiles'])
  if (!filePath) {
    return
  }
  await RendererWorker.invoke('FileSystem.writeFile', filePath, content)
}
