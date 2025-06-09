import type { Rpc } from '@lvce-editor/rpc-registry'
import { launchWorker } from '../LaunchWorker/LaunchWorker.ts'

export const launchRenameWorker = async (): Promise<Rpc> => {
  const name = 'Rename Worker'
  const url = 'renameWorkerMain.js'
  return launchWorker(name, url)
}
