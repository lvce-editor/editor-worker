import * as IpcState from '../IpcState/IpcState.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const invoke = async (method: string, ...params: any[]) => {
  const ipc = IpcState.get()
  return JsonRpc.invoke(ipc, method, ...params)
}

export const invokeAndTransfer = async (method: string, ...params: any[]) => {
  const ipc = IpcState.get()
  return JsonRpc.invokeAndTransfer(ipc, method, ...params)
}

export const listen = (ipc: any) => {
  IpcState.set(ipc)
}
