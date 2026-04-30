import type { Rpc } from '@lvce-editor/rpc-registry'
import { launchWorker } from '../LaunchWorker/LaunchWorker.ts'

export const launchEvaluationWorker = async (): Promise<Rpc> => {
  const name = 'Evaluation Worker'
  const url = 'evaluationWorkerMain.js'
  return launchWorker(name, url)
}
