import { OpenerWorker } from '@lvce-editor/rpc-registry'

export const showFilePicker = async (): Promise<string> => {
  const dialogTitle = 'Save File' // TODO use i18n string
  const { canceled, filePath } = await OpenerWorker.invoke('Open.showSaveDialog', dialogTitle, [])
  if (canceled) {
    return ''
  }
  return filePath
}
