import type { Rpc } from '@lvce-editor/rpc-registry'
import { launchWorker } from '../LaunchWorker/LaunchWorker.ts'

export const launchDebugWorker = async (): Promise<Rpc> => {
  const name = 'Debug Worker'
  const url = 'debugWorkerMain.js'
  return launchWorker(name, url)
}
