import { RendererWorker } from '@lvce-editor/rpc-registry'

export const isReadonlyFile = async (uri: string): Promise<boolean> => {
  return RendererWorker.invoke('FileSystem.isReadonly', uri)
}
