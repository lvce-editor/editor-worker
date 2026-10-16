import { expect, jest, test } from '@jest/globals'

const applyEdit = jest.fn()
const applyEditCommand = jest.fn(async (_editorUid: number, _edits: readonly any[], _selectionChanges?: Uint32Array) => {})
const wrapCommand = jest.fn((_command: any, _preservesTypingCoalescing: boolean, _returnState: boolean) => applyEditCommand)

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandApplyEdit.ts', () => ({
  applyEdit,
}))

jest.unstable_mockModule('../src/parts/WrapCommands/WrapCommands.ts', () => ({
  wrapCommand,
}))

const ExternalGetPositionAtCursor = await import('../src/parts/ExternalGetPositionAtCursor/ExternalGetPositionAtCursor.ts')

test('applyEdits2 uses the command wrapper and keeps the RPC response void', async () => {
  const editorUid = 1
  const edits = [{ inserted: ['value'] }]
  const selectionChanges = new Uint32Array([0, 0, 0, 5])

  await ExternalGetPositionAtCursor.applyEdits2(editorUid, edits, selectionChanges)

  expect(wrapCommand).toHaveBeenCalledWith(applyEdit, false, false)
  expect(applyEditCommand).toHaveBeenCalledWith(editorUid, edits, selectionChanges)
})
