import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const FindWidget = 'FindWidget'

export const openFind2 = async (state: any) => {
  await RendererWorker.invoke('Viewlet.openWidget', FindWidget)
  return state
}
