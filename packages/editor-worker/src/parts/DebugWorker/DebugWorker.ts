import { get, RpcId } from '@lvce-editor/rpc-registry'

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  const worker = get(RpcId.DebugWorker)
  return worker.invoke(method, ...params)
}
