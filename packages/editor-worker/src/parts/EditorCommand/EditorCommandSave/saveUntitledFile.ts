import * as ApplicationRpc from '../../ApplicationRpc/ApplicationRpc.ts'
import { showFilePicker } from './showFilePicker.ts'

export const saveUntitledFile = async (uri: string, content: string, platform: number, applicationId?: string): Promise<string | undefined> => {
  const filePath = await showFilePicker(platform)
  if (!filePath) {
    return
  }
  await ApplicationRpc.invoke(applicationId, 'FileSystem.writeFile', filePath, content)
  await ApplicationRpc.invoke(applicationId, 'Layout.handleWorkspaceRefresh')
  await ApplicationRpc.invoke(applicationId, 'Main.handleUriChange', uri, filePath)
  return filePath
}
