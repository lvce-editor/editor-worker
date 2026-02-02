import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const notifyTabModifiedStatusChange = async (uri: string): Promise<void> => {
  try {
    await RendererWorker.invoke('Main.handleModifiedStatusChange', uri, true)
  } catch {
    // ignore
  }
}
