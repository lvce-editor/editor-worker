import type { Rpc } from '@lvce-editor/rpc-registry'
import { launchWorker } from '../LaunchWorker/LaunchWorker.ts'

export const launchFindWidgetWorker = async (): Promise<Rpc> => {
  const name = 'Find Widget Worker'
  const url = 'findWidgetWorkerMain.js'
  return launchWorker(name, url)
}
