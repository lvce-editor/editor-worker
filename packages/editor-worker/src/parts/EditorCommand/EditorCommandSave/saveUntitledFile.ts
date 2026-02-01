import { RendererWorker } from '@lvce-editor/rpc-registry'
import { showFilePicker } from './showFilePicker.ts'

export const saveUntitledFile = async (uri: string, content: string, platform: number): Promise<string | undefined> => {
  const filePath = await showFilePicker(platform)
  if (!filePath) {
    return
  }
  await RendererWorker.invoke('FileSystem.writeFile', filePath, content)
  await RendererWorker.invoke('Layout.handleWorkspaceRefresh')
  return filePath
}
