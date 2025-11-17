import { RendererWorker } from '@lvce-editor/rpc-registry'

// TODO add tests for this
export const activateByEvent = async (event: string): Promise<void> => {
  await RendererWorker.invoke('ExtensionHostManagement.activateByEvent', event)
}
