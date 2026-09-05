import { afterEach, expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import * as EditorStatusDelivery from '../src/parts/EditorStatusDelivery/EditorStatusDelivery.ts'

const status = { column: 1, encoding: 'utf8', endOfLine: 'lf', insertSpaces: true, languageId: 'json', line: 1, tabSize: 2 }
const setup = (supportsDeltas = true) => {
  const supports = jest.fn(async () => supportsDeltas)
  const changed = jest.fn<(update: unknown) => Promise<void>>().mockResolvedValue(undefined)
  const rpc = createMockRpc({
    commandMap: {
      'StatusBar.handleEditorStatusChanged': changed,
      'StatusBar.supportsEditorStatusDeltas': supports,
    },
  })
  return { changed, rpc, supports }
}

afterEach(() => {
  EditorStatusDelivery.clear()
  jest.restoreAllMocks()
})

test('sends a full baseline followed by changed fields and suppresses equal values', async () => {
  const { changed, rpc, supports } = setup()
  await EditorStatusDelivery.send(1, rpc, status)
  await EditorStatusDelivery.send(1, rpc, { ...status, column: 7 })
  await EditorStatusDelivery.send(1, rpc, { ...status, column: 7 })
  expect(changed.mock.calls).toEqual([[status], [{ column: 7 }]])
  expect(supports).toHaveBeenCalledTimes(1)
})

test.each([false, true])('falls back to full messages when capability is false or rejects (%s)', async (reject) => {
  const { changed, rpc, supports } = setup(false)
  supports.mockImplementation(async () => {
    if (reject) {
      throw new Error('Unknown method')
    }
    return false
  })
  await EditorStatusDelivery.send(1, rpc, status)
  await EditorStatusDelivery.send(1, rpc, { ...status, column: 7 })
  expect(changed.mock.calls).toEqual([[status], [{ ...status, column: 7 }]])
  expect(supports).toHaveBeenCalledTimes(1)
})

test('listeners and replacement connections have independent baselines', async () => {
  const first = setup()
  const second = setup()
  await EditorStatusDelivery.send(1, first.rpc, status)
  await EditorStatusDelivery.send(2, second.rpc, { ...status, column: 3 })
  await EditorStatusDelivery.send(1, second.rpc, { ...status, column: 9 })
  expect(second.changed.mock.calls).toEqual([[{ ...status, column: 3 }], [{ ...status, column: 9 }]])
  expect(second.supports).toHaveBeenCalledTimes(2)
})

test('a failed delivery forces a full snapshot on the next update', async () => {
  const { changed, rpc } = setup()
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  await EditorStatusDelivery.send(1, rpc, status)
  changed.mockRejectedValueOnce(new Error('connection interrupted'))
  await EditorStatusDelivery.send(1, rpc, { ...status, column: 3 })
  await EditorStatusDelivery.send(1, rpc, { ...status, column: 3, languageId: 'typescript' })
  expect(changed.mock.calls).toEqual([[status], [{ column: 3 }], [{ ...status, column: 3, languageId: 'typescript' }]])
})

test('serializes slow delivery and retains only the latest pending snapshot', async () => {
  const { changed, rpc } = setup()
  await EditorStatusDelivery.send(1, rpc, status)
  const gate = Promise.withResolvers<void>()
  changed.mockReturnValueOnce(gate.promise)
  const first = EditorStatusDelivery.send(1, rpc, { ...status, column: 2 })
  const second = EditorStatusDelivery.send(1, rpc, { ...status, column: 3, line: 2 })
  const third = EditorStatusDelivery.send(1, rpc, { ...status, column: 4, line: 2 })
  expect(changed.mock.calls).toEqual([[status], [{ column: 2 }]])
  gate.resolve()
  await Promise.all([first, second, third])
  expect(changed.mock.calls).toEqual([[status], [{ column: 2 }], [{ column: 4, line: 2 }]])
})

test('clear removes the baseline and reopening sends a full snapshot', async () => {
  const { changed, rpc } = setup()
  await EditorStatusDelivery.send(1, rpc, status)
  await EditorStatusDelivery.send(1, rpc, undefined)
  await EditorStatusDelivery.send(1, rpc, undefined)
  await EditorStatusDelivery.send(1, rpc, status)
  expect(changed.mock.calls).toEqual([[status], [undefined], [status]])
})

test('unregister cancels pending work without affecting a new connection', async () => {
  const first = setup()
  const second = setup()
  const gate = Promise.withResolvers<boolean>()
  first.supports.mockReturnValueOnce(gate.promise)
  const pending = EditorStatusDelivery.send(1, first.rpc, status)
  EditorStatusDelivery.dispose(1)
  await EditorStatusDelivery.send(1, second.rpc, status)
  gate.resolve(true)
  await pending
  expect(first.changed).not.toHaveBeenCalled()
  expect(second.changed).toHaveBeenCalledWith(status)
})
