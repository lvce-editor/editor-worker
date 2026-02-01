import { RendererWorker } from '@lvce-editor/rpc-registry'

export const saveNormalFile = async (uri: string, content: string) => {
  await RendererWorker.invoke('FileSystem.writeFile', uri, content)
}
