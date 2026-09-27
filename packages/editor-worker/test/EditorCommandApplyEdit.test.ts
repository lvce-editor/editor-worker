import { expect, jest, test } from '@jest/globals'

const scheduleDocumentAndCursorsSelections = jest.fn(async (editor: any, _changes: readonly any[], _selectionChanges?: Uint32Array) => editor)

jest.unstable_mockModule('../src/parts/Editor/Editor.ts', () => ({
  scheduleDocumentAndCursorsSelections,
}))

const EditorCommandApplyEdit = await import('../src/parts/EditorCommand/EditorCommandApplyEdit.ts')

test('applyEdit schedules document changes without explicit selections', async () => {
  const editor = { uid: 1 }
  const changes = [{ inserted: ['value'] }]

  await EditorCommandApplyEdit.applyEdit(editor, changes)

  expect(scheduleDocumentAndCursorsSelections).toHaveBeenCalledWith(editor, changes, undefined)
})

test('applyEdit schedules document changes and explicit selections together', async () => {
  const editor = { uid: 1 }
  const changes = [{ inserted: ['value'] }]
  const selectionChanges = new Uint32Array([0, 0, 0, 5])

  await EditorCommandApplyEdit.applyEdit(editor, changes, selectionChanges)

  expect(scheduleDocumentAndCursorsSelections).toHaveBeenCalledWith(editor, changes, selectionChanges)
})
