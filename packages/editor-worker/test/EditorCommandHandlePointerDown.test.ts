import { expect, test } from '@jest/globals'
import * as EditorCommandHandlePointerDown from '../src/parts/EditorCommand/EditorCommandHandlePointerDown.ts'

test('handlePointerDown - returns state unchanged for detail 0', async () => {
  const editor = {
    isSelecting: false,
  }

  const result = await EditorCommandHandlePointerDown.handlePointerDown(editor as any, 0, false, false, 0, 0, 0)

  expect(result).toBe(editor)
})

test('handlePointerDown - returns state unchanged for detail 1', async () => {
  const editor = {
    isSelecting: false,
  }

  const result = await EditorCommandHandlePointerDown.handlePointerDown(editor as any, 0, false, false, 0, 0, 1)

  expect(result).toBe(editor)
})
