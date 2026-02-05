import * as Assert from '../Assert/Assert.ts'

interface ListenerRegistry {
  [listenerType: number]: number[]
}

const state: ListenerRegistry = Object.create(null)

/**
 * Register a listener for a specific event type
 * @param listenerType - The type of event to listen for
 * @param rpcId - The RPC ID of the listener
 */
export const registerListener = (listenerType: number, rpcId: number): void => {
  Assert.number(listenerType)
  Assert.number(rpcId)
  
  if (!state[listenerType]) {
    state[listenerType] = []
  }
  
  // Avoid duplicate registrations
  if (!state[listenerType].includes(rpcId)) {
    state[listenerType].push(rpcId)
  }
}

/**
 * Unregister a listener for a specific event type
 * @param listenerType - The type of event to listen for
 * @param rpcId - The RPC ID of the listener
 */
export const unregisterListener = (listenerType: number, rpcId: number): void => {
  Assert.number(listenerType)
  Assert.number(rpcId)
  
  if (state[listenerType]) {
    const index = state[listenerType].indexOf(rpcId)
    if (index !== -1) {
      state[listenerType].splice(index, 1)
    }
  }
}

/**
 * Get all registered listeners for a specific event type
 * @param listenerType - The type of event
 * @returns Array of RPC IDs
 */
export const getListeners = (listenerType: number): readonly number[] => {
  Assert.number(listenerType)
  return state[listenerType] || []
}

/**
 * Clear all listeners for a specific event type
 * @param listenerType - The type of event
 */
export const clearListeners = (listenerType: number): void => {
  Assert.number(listenerType)
  delete state[listenerType]
}

/**
 * Clear all listeners
 */
export const clearAll = (): void => {
  for (const key of Object.keys(state)) {
    delete state[Number(key)]
  }
}
