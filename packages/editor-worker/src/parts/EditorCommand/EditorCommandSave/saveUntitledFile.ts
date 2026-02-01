import { RendererWorker } from '@lvce-editor/rpc-registry'
import { showFilePicker } from './showFilePicker.ts'

export const saveUntitledFile = async (uri: string, content: string, platform: number) => {
  const filePath = await showFilePicker(platform)
  if (!filePath) {
    return
  }
  await RendererWorker.invoke('FileSystem.writeFile', filePath, content)
}
