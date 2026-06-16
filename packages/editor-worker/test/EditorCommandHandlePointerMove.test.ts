import { expect, test } from '@jest/globals'
import * as EditorCommandHandlePointerMove from '../src/parts/EditorCommand/EditorCommandHandlePointerMove.ts'
import * as EditorSelectionAutoMoveState from '../src/parts/EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.ts'

test('handlePointerMove - ignores moves after selection stopped', async () => {
  const editor = {}
  EditorSelectionAutoMoveState.stopSelecting()

  const result = await EditorCommandHandlePointerMove.handlePointerMove(editor, 0, 0, false)

  expect(result).toBe(editor)
})
