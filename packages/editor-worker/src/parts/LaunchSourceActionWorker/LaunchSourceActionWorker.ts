import type { Rpc } from '@lvce-editor/rpc-registry'
import { launchWorker } from '../LaunchWorker/LaunchWorker.ts'

export const launchSourceActionWorker = async (): Promise<Rpc> => {
  const name = 'Source Action Worker'
  const url = 'sourceActionWorkerMain.js'
  const intializeCommand = 'SourceActions.initialize'
  const rpc = await launchWorker(name, url, intializeCommand)
  return rpc
}
