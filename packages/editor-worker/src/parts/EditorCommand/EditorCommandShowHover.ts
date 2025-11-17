import { RendererWorker } from '@lvce-editor/rpc-registry'

const EditorHover = 'EditorHover'

export const showHover = async (state: any) => {
  await RendererWorker.invoke('Viewlet.openWidget', EditorHover)
  return state
}
