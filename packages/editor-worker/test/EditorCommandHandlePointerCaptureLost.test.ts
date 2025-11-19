import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

const EditorSelectionAutoMoveState = await import('../src/parts/EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.ts')
const EditorCommandHandlePointerCaptureLost = await import('../src/parts/EditorCommand/EditorCommandHandlePointerCaptureLost.ts')

test.skip('handlePointerCaptureLost', () => {
  // Skipped: Cannot spy on ES module exports (read-only properties)
  const clearEditorSpy = jest.spyOn(EditorSelectionAutoMoveState, 'clearEditor')
  const editor = {
    lineCache: [],
  }
  expect(EditorCommandHandlePointerCaptureLost.handlePointerCaptureLost(editor)).toBe(editor)
  expect(clearEditorSpy).toHaveBeenCalledTimes(1)
  clearEditorSpy.mockRestore()
})
