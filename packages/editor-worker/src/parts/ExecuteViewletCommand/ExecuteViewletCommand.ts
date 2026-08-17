import { RendererWorker } from '@lvce-editor/rpc-registry'

export const executeViewletCommand = async (
  commandMap: Readonly<Record<string, unknown>>,
  uid: number,
  commandId: string,
  ...args: readonly any[]
): Promise<void> => {
  const fn = commandMap[commandId]
  if (typeof fn !== 'function') {
    throw new TypeError(`Viewlet command not found: ${commandId}`)
  }
  await fn(uid, ...args)
  await RendererWorker.invoke('Viewlet.requestRender', uid)
}
