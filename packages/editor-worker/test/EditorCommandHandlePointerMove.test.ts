import { expect, test } from '@jest/globals'
import * as EditorCommandHandlePointerMove from '../src/parts/EditorCommand/EditorCommandHandlePointerMove.ts'

test('handlePointerMove - ignores moves after selection stopped', async () => {
  const editor = {
    isSelecting: false,
  }

  const result = await EditorCommandHandlePointerMove.handlePointerMove(editor, 0, 0, false)

  expect(result).toBe(editor)
})
