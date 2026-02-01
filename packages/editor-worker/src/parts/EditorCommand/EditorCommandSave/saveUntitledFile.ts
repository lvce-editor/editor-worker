import { RendererWorker } from '@lvce-editor/rpc-registry'
<<<<<<< HEAD
import { showFilePicker } from './showFilePicker.js'

export const saveUntitledFile = async (uri: string, content: string) => {
  const filePath = await showFilePicker()
=======

export const saveUntitledFile = async (uri: string, content: string) => {
  const [filePath] = await RendererWorker.invoke('ElectronDialog.showOpenDialog', 'Save File', ['openFile', 'dontAddToRecent', 'showHiddenFiles'])
>>>>>>> origin/main
  if (!filePath) {
    return
  }
  await RendererWorker.invoke('FileSystem.writeFile', filePath, content)
}
