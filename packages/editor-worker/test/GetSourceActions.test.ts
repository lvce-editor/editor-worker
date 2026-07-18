import { beforeEach, expect, jest, test } from '@jest/globals'

const executeMock = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()

jest.unstable_mockModule('../src/parts/ExtensionHostEditor/ExtensionHostEditor.ts', () => ({
  execute: executeMock,
}))

const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const { emptyEditor } = await import('../src/parts/EmptyEditor/EmptyEditor.ts')
const { getEditorSourceActions } = await import('../src/parts/GetSourceActions/GetSourceActions.ts')

beforeEach(() => {
  executeMock.mockReset()
})

test('getEditorSourceActions executes the activated extension-host provider', async () => {
  const editorId = 123_456
  const editor = {
    ...emptyEditor,
    id: editorId,
    languageId: 'typescript',
    lines: ['const value = unknownName'],
    selections: new Uint32Array([0, 14, 0, 14]),
    uid: editorId,
    widgets: [],
  }
  const actions = [
    {
      kind: 'source.organizeImports',
      languageId: 'typescript',
      name: 'Organize Imports',
    },
  ]
  EditorStates.set(editorId, editor, editor)
  executeMock.mockResolvedValue(actions)

  await expect(getEditorSourceActions(editorId)).resolves.toBe(actions)
  expect(executeMock).toHaveBeenCalledWith({
    args: [14],
    editor,
    event: 'onLanguage',
    method: 'ExtensionHostCodeActions.getSourceActions',
  })
})

test('getEditorSourceActions returns no actions without an editor id', async () => {
  await expect(getEditorSourceActions()).resolves.toEqual([])
  expect(executeMock).not.toHaveBeenCalled()
})
