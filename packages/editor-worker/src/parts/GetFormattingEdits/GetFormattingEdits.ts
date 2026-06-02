import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const getFormattingEdits = async (editor: any): Promise<readonly any[]> => {
  return ExtensionManagementWorker.invoke('Extensions.executeFormattingProvider', editor)
}
