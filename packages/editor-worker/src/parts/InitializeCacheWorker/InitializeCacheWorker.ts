import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { CacheWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const registerCacheWorker = async (): Promise<void> => {
  const lazyRpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    async send(port): Promise<void> {
      try {
        await RendererWorker.sendMessagePortToCacheWorker(port)
      } catch (error) {
        // Retry registration after a failed connection; the lazy RPC retains rejected connection promises.
        await registerCacheWorker()
        throw error
      }
    },
  })
  CacheWorker.set(lazyRpc)
}

export const initializeCacheWorker = async (): Promise<void> => {
  await registerCacheWorker()
}
