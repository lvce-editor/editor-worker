import { RendererWorker } from '@lvce-editor/rpc-registry'

export const showSaveErrorDialog = async (error: Error): Promise<void> => {
  await RendererWorker.invoke('ElectronDialog.showMessageBox', {
    buttons: ['OK'],
    defaultId: 0,
    detail: error.message,
    message: 'Saving the file failed.',
    title: 'Failed to Save File',
    type: 'error',
  })
}
