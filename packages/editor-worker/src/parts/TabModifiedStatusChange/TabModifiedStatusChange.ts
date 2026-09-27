import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'

export const notifyTabModifiedStatusChange = async (uri: string, modified: boolean, applicationId?: string): Promise<void> => {
  try {
    await ApplicationRpc.invoke(applicationId, 'Main.handleModifiedStatusChange', uri, modified)
  } catch {
    // ignore
  }
}
