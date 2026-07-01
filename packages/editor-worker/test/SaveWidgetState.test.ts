import { beforeEach, expect, jest, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'

const invokeMock: any = jest.fn()

jest.unstable_mockModule('../src/parts/FindWidgetWorker/FindWidgetWorker.ts', () => ({
  invoke: invokeMock,
}))

const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const SaveWidgetState = await import('../src/parts/SaveWidgetState/SaveWidgetState.ts')

beforeEach(() => {
  invokeMock.mockReset()
})

test('saveWidgetState - skips missing editor key', async () => {
  const result = await SaveWidgetState.saveWidgetState(['910001'])

  expect(Object.keys(result)).toEqual([])
  expect(invokeMock).not.toHaveBeenCalled()
})

test('saveWidgetState - skips widget without newState', async () => {
  EditorStates.set(
    910002,
    {},
    {
      uid: 910002,
      widgets: [
        {
          id: WidgetId.Find,
        },
      ],
    },
  )

  const result = await SaveWidgetState.saveWidgetState(['910002'])

  expect(Object.keys(result)).toEqual([])
  expect(invokeMock).not.toHaveBeenCalled()
})

test('saveWidgetState - skips unsupported widget', async () => {
  EditorStates.set(
    910003,
    {},
    {
      uid: 910003,
      widgets: [
        {
          id: WidgetId.Completion,
          newState: {
            uid: 1,
          },
        },
      ],
    },
  )

  const result = await SaveWidgetState.saveWidgetState(['910003'])

  expect(Object.keys(result)).toEqual([])
  expect(invokeMock).not.toHaveBeenCalled()
})

test('saveWidgetState - saves find widget state', async () => {
  invokeMock.mockResolvedValue({
    searchValue: 'abc',
  })
  EditorStates.set(
    910004,
    {},
    {
      uid: 910004,
      widgets: [
        {
          id: WidgetId.Find,
          newState: {
            uid: 2,
          },
        },
      ],
    },
  )

  const result = await SaveWidgetState.saveWidgetState(['910004'])

  expect(invokeMock).toHaveBeenCalledWith('FindWidget.saveState', 2)
  expect(result['910004:2']).toEqual({
    searchValue: 'abc',
  })
})
