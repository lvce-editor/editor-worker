import type { Rpc } from '@lvce-editor/rpc-registry'
import { launchWorker } from '../LaunchWorker/LaunchWorker.ts'

export const launchCompletionWorker = async (): Promise<Rpc> => {
  const name = 'Completion Worker'
  const url = 'completionWorkerMain.js'
  const rpc = await launchWorker(name, url)
  await rpc.invoke('Completions.initialize')
  return rpc
}
