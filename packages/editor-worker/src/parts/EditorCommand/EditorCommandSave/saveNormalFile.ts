import * as ApplicationRpc from '../../ApplicationRpc/ApplicationRpc.ts'

export const saveNormalFile = async (uri: string, content: string, applicationId?: string) => {
  await ApplicationRpc.invoke(applicationId, 'FileSystem.writeFile', uri, content, 'utf8', false)
}
