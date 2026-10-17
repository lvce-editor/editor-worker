import type { Rpc } from '@lvce-editor/rpc'

let rpc: Rpc | undefined

export const isConnected = (): boolean => rpc !== undefined

export const set = (value: Rpc): void => {
  rpc = value
}

export const invoke = (method: string, ...params: readonly unknown[]): Promise<any> => {
  if (!rpc) {
    throw new Error('Editor renderer process is not connected')
  }
  return rpc.invoke(method, ...params)
}
