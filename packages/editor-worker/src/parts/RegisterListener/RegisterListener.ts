import * as Assert from '../Assert/Assert.ts'
import * as EditorListeners from '../EditorListeners/EditorListeners.ts'
import { initializeListener } from '../NotifyEditorStatusChange/NotifyEditorStatusChange.ts'

/**
 * Register a listener for editor events
 * @param listenerType - The type of event to listen for (from ListenerType enum)
 * @param rpcId - The RPC ID of the listener that will be notified
 */
export const registerListener = async (listenerType: number, rpcId: number): Promise<void> => {
  Assert.number(listenerType)
  Assert.number(rpcId)
  EditorListeners.registerListener(listenerType, rpcId)
  await initializeListener(rpcId)
}
