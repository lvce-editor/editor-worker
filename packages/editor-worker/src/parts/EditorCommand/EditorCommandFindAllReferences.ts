import { RendererWorker } from '@lvce-editor/rpc-registry'

export const findAllReferences = async (editor: any) => {
  // @ts-ignore
  await RendererWorker.invoke('SideBar.show', 'References', /* focus */ true)
  return editor
}
