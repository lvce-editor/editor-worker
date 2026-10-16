import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.ts'

export const invoke = async (applicationId: string | undefined, method: string, ...args: readonly unknown[]): Promise<any> => {
  return applicationId === undefined
    ? RendererWorker.invoke(method, ...args)
    : RendererWorker.invoke('Application.execute', applicationId, method, ...args)
}

export const readFile = async (applicationId: string | undefined, uri: string): Promise<string> => {
  return applicationId === undefined
    ? FileSystemWorker.invoke('FileSystem.readFile', uri)
    : FileSystemWorker.invoke('ApplicationFileSystem.execute', applicationId, 'readFile', uri)
}
