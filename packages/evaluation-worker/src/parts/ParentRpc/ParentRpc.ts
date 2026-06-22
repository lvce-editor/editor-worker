let rpc: any = undefined

export const set = (value: any): void => {
  rpc = value
}

export const invoke = async (method: string, ...params: readonly unknown[]): Promise<unknown> => {
  if (!rpc) {
    throw new Error('parent rpc not initialized')
  }
  return rpc.invoke(method, ...params)
}
