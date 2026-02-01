import { RendererWorker } from '@lvce-editor/rpc-registry'
import { showFilePicker } from './showFilePicker.js'

export const saveUntitledFile = async (uri: string, content: string) => {
  const filePath = await showFilePicker()
  if (!filePath) {
    return
  }
  await RendererWorker.invoke('FileSystem.writeFile', filePath, content)
}
