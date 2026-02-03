import { OpenerWorker } from '@lvce-editor/rpc-registry'

export const showFilePicker = async (platform: number): Promise<string> => {
  const dialogTitle = 'Save File' // TODO use i18n string
  const { canceled, filePath } = await OpenerWorker.invoke('Open.showSaveDialog', dialogTitle, [], platform)
  if (canceled) {
    return ''
  }
  return filePath
}
