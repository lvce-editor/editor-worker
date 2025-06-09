import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const findAllReferences = async (editor: any) => {
  // @ts-ignore
  await RendererWorker.invoke('SideBar.show', 'References', /* focus */ true)
  return editor
}
