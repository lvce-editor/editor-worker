import { RendererWorker } from '@lvce-editor/rpc-registry'

export const invoke = (...args: Parameters<typeof RendererWorker.invoke>): ReturnType<typeof RendererWorker.invoke> => RendererWorker.invoke(...args)

export const invokeAndTransfer = (
  ...args: Parameters<typeof RendererWorker.invokeAndTransfer>
): ReturnType<typeof RendererWorker.invokeAndTransfer> => RendererWorker.invokeAndTransfer(...args)

export const readFile = (...args: Parameters<typeof RendererWorker.readFile>): ReturnType<typeof RendererWorker.readFile> =>
  RendererWorker.readFile(...args)

export const set = (...args: Parameters<typeof RendererWorker.set>): ReturnType<typeof RendererWorker.set> => RendererWorker.set(...args)
