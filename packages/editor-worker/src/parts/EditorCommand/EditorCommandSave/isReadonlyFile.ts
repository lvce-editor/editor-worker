import * as ApplicationRpc from '../../ApplicationRpc/ApplicationRpc.ts'

export const isReadonlyFile = async (uri: string, applicationId?: string): Promise<boolean> => {
  return ApplicationRpc.invoke(applicationId, 'FileSystem.isReadonly', uri)
}
