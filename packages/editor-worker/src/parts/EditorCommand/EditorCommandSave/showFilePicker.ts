import { RendererWorker } from '@lvce-editor/rpc-registry'

export const showFilePicker = async (): Promise<string | undefined> => {
  const [filePath] = await RendererWorker.invoke('ElectronDialog.showOpenDialog', 'Save File', ['openFile', 'dontAddToRecent', 'showHiddenFiles'])
  return filePath
}
