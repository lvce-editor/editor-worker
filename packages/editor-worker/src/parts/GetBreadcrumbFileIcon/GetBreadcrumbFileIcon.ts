import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'

export const getBreadcrumbFileIcon = async (uri: string, applicationId?: string): Promise<string> => {
  try {
    const icon = await ApplicationRpc.invoke(applicationId, 'IconTheme.getFileIcon', { name: decodeURIComponent(uri.split('/').at(-1) || '') })
    return typeof icon === 'string' ? icon : ''
  } catch {
    return ''
  }
}
