import { RendererWorker } from '@lvce-editor/rpc-registry'

const isPermissionDeniedError = (error: Error): boolean => {
  const errorCode = 'code' in error ? error.code : undefined
  return errorCode === 'EACCES' || error.message.includes('EACCES:')
}

export const showSaveErrorDialog = async (error: Error): Promise<void> => {
  if (isPermissionDeniedError(error)) {
    await RendererWorker.invoke('ElectronDialog.showMessageBox', {
      buttons: ['OK'],
      defaultId: 0,
      message: "You don't have permission to save changes to this file.",
      title: 'Unable to Save File',
      type: 'error',
    })
    return
  }
  await RendererWorker.invoke('ElectronDialog.showMessageBox', {
    buttons: ['OK'],
    defaultId: 0,
    detail: error.message,
    message: 'Saving the file failed.',
    title: 'Failed to Save File',
    type: 'error',
  })
}
