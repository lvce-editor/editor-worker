import { expect, test } from '@jest/globals'
import * as EditorCommandHandlePointerUp from '../src/parts/EditorCommand/EditorCommandHandlePointerUp.ts'
import * as EditorSelectionAutoMoveState from '../src/parts/EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.ts'

test('handlePointerUp - clears selection auto move state', () => {
  const editor = {}
  EditorSelectionAutoMoveState.setEditor(editor)
  expect(EditorSelectionAutoMoveState.hasListener()).toBe(true)

  const result = EditorCommandHandlePointerUp.handlePointerUp(editor)

  expect(result).toBe(editor)
  expect(EditorSelectionAutoMoveState.hasListener()).toBe(false)
})
