import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const notifyTabModifiedStatusChange = async (uri: string, modified: boolean): Promise<void> => {
  try {
    await RendererWorker.invoke('Main.handleModifiedStatusChange', uri, modified)
  } catch {
    // ignore
  }
}
