import { beforeEach, expect, test } from '@jest/globals'
import * as EditorListeners from '../src/parts/EditorListeners/EditorListeners.ts'
import * as ListenerType from '../src/parts/ListenerType/ListenerType.ts'

beforeEach(() => {
  EditorListeners.clearAll()
})

test('registerListener - should register a listener for an event type', () => {
  const rpcId = 100
  EditorListeners.registerListener(ListenerType.EditorChange, rpcId)

  const listeners = EditorListeners.getListeners(ListenerType.EditorChange)
  expect(listeners).toEqual([rpcId])
})

test('registerListener - should not register duplicate listeners', () => {
  const rpcId = 100
  EditorListeners.registerListener(ListenerType.EditorChange, rpcId)
  EditorListeners.registerListener(ListenerType.EditorChange, rpcId)

  const listeners = EditorListeners.getListeners(ListenerType.EditorChange)
  expect(listeners).toEqual([rpcId])
})

test('registerListener - should support multiple listeners for same type', () => {
  const rpcId1 = 100
  const rpcId2 = 200
  EditorListeners.registerListener(ListenerType.EditorChange, rpcId1)
  EditorListeners.registerListener(ListenerType.EditorChange, rpcId2)

  const listeners = EditorListeners.getListeners(ListenerType.EditorChange)
  expect(listeners).toEqual([rpcId1, rpcId2])
})

test('registerListener - should support different event types', () => {
  const rpcId1 = 100
  const rpcId2 = 200
  EditorListeners.registerListener(ListenerType.EditorChange, rpcId1)
  EditorListeners.registerListener(ListenerType.EditorSelection, rpcId2)

  const changeListeners = EditorListeners.getListeners(ListenerType.EditorChange)
  const selectionListeners = EditorListeners.getListeners(ListenerType.EditorSelection)

  expect(changeListeners).toEqual([rpcId1])
  expect(selectionListeners).toEqual([rpcId2])
})

test('unregisterListener - should remove a registered listener', () => {
  const rpcId = 100
  EditorListeners.registerListener(ListenerType.EditorChange, rpcId)
  EditorListeners.unregisterListener(ListenerType.EditorChange, rpcId)

  const listeners = EditorListeners.getListeners(ListenerType.EditorChange)
  expect(listeners).toEqual([])
})

test('unregisterListener - should only remove the specified listener', () => {
  const rpcId1 = 100
  const rpcId2 = 200
  EditorListeners.registerListener(ListenerType.EditorChange, rpcId1)
  EditorListeners.registerListener(ListenerType.EditorChange, rpcId2)
  EditorListeners.unregisterListener(ListenerType.EditorChange, rpcId1)

  const listeners = EditorListeners.getListeners(ListenerType.EditorChange)
  expect(listeners).toEqual([rpcId2])
})

test('getListeners - should return empty array for unregistered type', () => {
  const listeners = EditorListeners.getListeners(ListenerType.EditorChange)
  expect(listeners).toEqual([])
})

test('clearListeners - should remove all listeners for a type', () => {
  const rpcId1 = 100
  const rpcId2 = 200
  EditorListeners.registerListener(ListenerType.EditorChange, rpcId1)
  EditorListeners.registerListener(ListenerType.EditorChange, rpcId2)
  EditorListeners.clearListeners(ListenerType.EditorChange)

  const listeners = EditorListeners.getListeners(ListenerType.EditorChange)
  expect(listeners).toEqual([])
})

test('clearAll - should remove all listeners for all types', () => {
  const rpcId1 = 100
  const rpcId2 = 200
  EditorListeners.registerListener(ListenerType.EditorChange, rpcId1)
  EditorListeners.registerListener(ListenerType.EditorSelection, rpcId2)
  EditorListeners.clearAll()

  const changeListeners = EditorListeners.getListeners(ListenerType.EditorChange)
  const selectionListeners = EditorListeners.getListeners(ListenerType.EditorSelection)

  expect(changeListeners).toEqual([])
  expect(selectionListeners).toEqual([])
})
