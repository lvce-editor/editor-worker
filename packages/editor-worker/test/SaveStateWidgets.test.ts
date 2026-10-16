import { beforeEach, expect, jest, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'

const invokeMock = jest.fn<(...args: readonly any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/FindWidgetWorker/FindWidgetWorker.ts', () => ({
  invoke: invokeMock,
}))

const SaveState = await import('../src/parts/SaveState/SaveState.ts')

beforeEach(() => {
  invokeMock.mockReset()
  invokeMock.mockResolvedValue({ value: 'saved query' })
})

test('saveState persists find widget state and excludes transient widgets', async () => {
  const state = {
    lines: ['line'],
    redoStack: [],
    undoStack: [],
    widgets: [
      {
        id: WidgetId.Find,
        newState: { uid: 10 },
      },
      {
        id: WidgetId.Hover,
        newState: { uid: 11 },
      },
    ],
  }

  await expect(SaveState.saveState(state as any, undefined)).resolves.toEqual({
    widgets: [{ id: WidgetId.Find, state: { value: 'saved query' } }],
  })
  expect(invokeMock).toHaveBeenCalledTimes(1)
  expect(invokeMock).toHaveBeenCalledWith('FindWidget.saveState', 10)
})
