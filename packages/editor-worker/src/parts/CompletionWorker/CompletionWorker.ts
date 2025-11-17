import { createLazyRpc, RpcId } from '@lvce-editor/rpc-registry'

export const { setFactory, invoke } = createLazyRpc(RpcId.CompletionWorker)
