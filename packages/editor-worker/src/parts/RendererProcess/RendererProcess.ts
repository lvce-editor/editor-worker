import type { Rpc } from '@lvce-editor/rpc'

const state: { rpc: Rpc | undefined } = { rpc: undefined }

export const isConnected = (): boolean => {
  const { rpc } = state
  return rpc !== undefined
}

export const set = (value: Rpc): void => {
  state.rpc = value
}

export const invoke = (method: string, ...params: readonly unknown[]): Promise<any> => {
  const { rpc } = state
  if (!rpc) {
    throw new Error('Editor renderer process is not connected')
  }
  return rpc.invoke(method, ...params)
}
