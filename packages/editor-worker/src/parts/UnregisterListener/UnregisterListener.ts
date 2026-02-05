import * as Assert from '../Assert/Assert.ts'
import * as EditorListeners from '../EditorListeners/EditorListeners.ts'

/**
 * Unregister a listener for editor events
 * @param listenerType - The type of event to stop listening for
 * @param rpcId - The RPC ID of the listener to unregister
 */
export const unregisterListener = (listenerType: number, rpcId: number): void => {
  Assert.number(listenerType)
  Assert.number(rpcId)
  EditorListeners.unregisterListener(listenerType, rpcId)
}
