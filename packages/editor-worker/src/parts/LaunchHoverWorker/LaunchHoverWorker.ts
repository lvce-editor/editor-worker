import type { Rpc } from '@lvce-editor/rpc-registry'
import { launchWorker } from '../LaunchWorker/LaunchWorker.ts'

export const launchHoverWorker = async (): Promise<Rpc> => {
  const name = 'Hover Worker'
  const url = 'hoverWorkerMain.js'
  const intializeCommand = 'Hover.initialize'
  const rpc = await launchWorker(name, url, intializeCommand)
  return rpc
}
