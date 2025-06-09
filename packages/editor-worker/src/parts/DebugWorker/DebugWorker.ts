import type { Rpc } from '@lvce-editor/rpc'

const getOrCreate = async (): Promise<Rpc> => {
  return {} as any
}

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  const worker = await getOrCreate()
  return worker.invoke(method, ...params)
}
