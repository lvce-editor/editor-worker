import { afterEach, expect, jest, test } from '@jest/globals'

const invokeMock: any = jest.fn()

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  RendererWorker: {
    invoke: invokeMock,
  },
  TextMeasurementWorker: {
    invoke: jest.fn(),
  },
}))

const EditorCommandShowMessage = await import('../src/parts/EditorCommand/EditorCommandShowMessage.ts')
const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')

afterEach(() => {
  jest.useRealTimers()
  invokeMock.mockReset()
})

test('editorShowMessage adds an overlay message widget', async () => {
  const editor = {
    columnWidth: 8,
    rowHeight: 20,
    uid: 1,
    widgets: [],
    x: 10,
    y: 30,
  }

  const newEditor = await EditorCommandShowMessage.editorShowMessage(editor, 2, 3, 'No definition found', true)

  expect(newEditor.widgets).toEqual([
    {
      id: 9,
      newState: {
        message: 'No definition found',
        uid: expect.any(Number),
        x: 34,
        y: 90,
      },
      oldState: {
        message: 'No definition found',
        uid: expect.any(Number),
        x: 34,
        y: 90,
      },
    },
  ])
})

test('editorShowMessage hides a non-error message after three seconds', async () => {
  jest.useFakeTimers()
  const editor = {
    columnWidth: 8,
    rowHeight: 20,
    uid: 2,
    widgets: [],
    x: 10,
    y: 30,
  } as any

  const editorWithMessage = await EditorCommandShowMessage.editorShowMessage(editor, 2, 3, 'No definition found', false)
  EditorStates.set(editor.uid, editor, editorWithMessage)
  await jest.advanceTimersByTimeAsync(3000)

  const latest = EditorStates.get(editor.uid)
  expect(latest.oldState).toBe(editorWithMessage)
  expect(latest.newState.widgets).toEqual([])
  expect(invokeMock).toHaveBeenCalledWith('Editor.rerender', editor.uid)
})
