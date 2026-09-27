import { expect, jest, test } from '@jest/globals'

const applyEdit = jest.fn(async (editor: any, _edits: readonly any[], _selectionChanges?: Uint32Array) => ({ ...editor, applied: true }))

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandApplyEdit.ts', () => ({
  applyEdit,
}))

jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({
  updateDerivedState: jest.fn(async (_oldEditor, newEditor) => newEditor),
}))

const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const ExternalGetPositionAtCursor = await import('../src/parts/ExternalGetPositionAtCursor/ExternalGetPositionAtCursor.ts')

test('applyEdits2 forwards selection changes and stores the updated editor', async () => {
  const editorUid = 1
  const editor = { uid: editorUid }
  const edits = [{ inserted: ['value'] }]
  const selectionChanges = new Uint32Array([0, 0, 0, 5])
  EditorStates.set(editorUid, editor as any, editor as any)

  await ExternalGetPositionAtCursor.applyEdits2(editorUid, edits, selectionChanges)

  expect(applyEdit).toHaveBeenCalledWith(editor, edits, selectionChanges)
  expect(EditorStates.get(editorUid)?.newState).toEqual({ applied: true, uid: editorUid })
})
