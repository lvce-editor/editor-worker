import * as Assert from '../Assert/Assert.ts'
import * as EditorListeners from '../EditorListeners/EditorListeners.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

/**
 * Notify all registered listeners of a specific event type
 * @param listenerType - The type of event that occurred
 * @param method - The method name to invoke on the listener
 * @param params - Parameters to pass to the listener method
 */
export const notifyListeners = async (listenerType: number, method: string, ...params: any[]): Promise<void> => {
  Assert.number(listenerType)
  Assert.string(method)
  
  const rpcIds = EditorListeners.getListeners(listenerType)
  
  // Notify all listeners in parallel
  const notifications = rpcIds.map(async (rpcId) => {
    try {
      const rpc = RpcRegistry.get(rpcId)
      if (rpc) {
        await rpc.invoke(method, ...params)
      }
    } catch (error) {
      // Silently ignore errors from individual listeners
      // to prevent one failing listener from affecting others
      console.warn(`Failed to notify listener ${rpcId}:`, error)
    }
  })
  
  await Promise.all(notifications)
}
