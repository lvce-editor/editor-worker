import { launchEvaluationWorker } from '../LaunchEvaluationWorker/LaunchEvaluationWorker.ts'
import * as ListenerType from '../ListenerType/ListenerType.ts'
import * as RpcId from '../RpcId/RpcId.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

export const initializeEvaluationWorker = async (): Promise<void> => {
  const rpc = await launchEvaluationWorker()
  RpcRegistry.set(RpcId.EvaluationWorker, rpc)
  await rpc.invoke('Evaluation.initialize', RpcId.EvaluationWorker, ListenerType.EditorChange)
}
