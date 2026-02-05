import * as Assert from '../Assert/Assert.ts'
import * as EditorListeners from '../EditorListeners/EditorListeners.ts'

/**
 * Register a listener for editor events
 * @param listenerType - The type of event to listen for (from ListenerType enum)
 * @param rpcId - The RPC ID of the listener that will be notified
 */
export const registerListener = (listenerType: number, rpcId: number): void => {
  Assert.number(listenerType)
  Assert.number(rpcId)
  EditorListeners.registerListener(listenerType, rpcId)
}
