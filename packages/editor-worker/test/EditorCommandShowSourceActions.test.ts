import { beforeEach, expect, jest, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'

const invokeMock = jest.fn<(...args: readonly unknown[]) => Promise<readonly unknown[] | undefined>>()

jest.unstable_mockModule('../src/parts/SourceActionWorker/SourceActionWorker.ts', () => ({
  invoke: invokeMock,
}))

jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({
  updateDerivedState: (oldState: unknown, newState: unknown) => newState,
}))

const { commandMap } = await import('../src/parts/CommandMap/CommandMap.ts')
const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const { emptyEditor } = await import('../src/parts/EmptyEditor/EmptyEditor.ts')

beforeEach(() => {
  invokeMock.mockReset()
  invokeMock.mockResolvedValue([])
})

const commandIds = ['Editor.showSourceActions', 'Editor.showSourceActions2', 'Editor.showSourceActions3'] as const

test.each(commandIds)('%s resolves the editor state from its uid', async (commandId) => {
  const editorUid = Math.random()
  const editor = {
    ...emptyEditor,
    id: editorUid,
    languageId: 'typescript',
    uid: editorUid,
    widgets: [],
  }
  EditorStates.set(editorUid, editor, editor)

  await commandMap[commandId](editorUid)

  const { newState } = EditorStates.get(editorUid)
  expect(newState.widgets).toHaveLength(1)
  expect(newState.widgets[0]).toMatchObject({
    id: WidgetId.SourceAction,
    newState: {
      editorUid,
    },
  })
  expect(invokeMock).toHaveBeenCalledWith('SourceActions.create', expect.any(Number), 0, 0, 0, 0, editorUid, 'typescript')
})
