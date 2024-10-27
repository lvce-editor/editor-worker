import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

// TODO maybe ask extension host worker instead
export const getEditorSourceActions = async () => {
  const sourceActions = await RendererWorker.invoke('GetEditorSourceActions.getEditorSourceActions')
  return sourceActions
}
