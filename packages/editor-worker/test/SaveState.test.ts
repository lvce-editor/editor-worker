import { expect, test } from '@jest/globals'
import { saveState } from '../src/parts/SaveState/SaveState.ts'

test('saveState preserves document history', async () => {
  const lines = ['first line', 'second line']
  const redoStack = [['redo change']]
  const undoStack = [['undo change']]

  await expect(saveState({ lines, redoStack, undoStack } as any, undefined)).resolves.toEqual({
    lines,
    redoStack,
    undoStack,
  })
})

test('saveState preserves large file mode', async () => {
  await expect(saveState({ largeFile: true, lines: ['text'], redoStack: [], undoStack: [] } as any, undefined)).resolves.toMatchObject({
    largeFile: true,
  })
})

test('saveState preserves explicitly selected language modes', async () => {
  await expect(saveState({ explicitLanguageId: 'javascript', lines: [], redoStack: [], undoStack: [] } as any, undefined)).resolves.toEqual({
    explicitLanguageId: 'javascript',
  })
})

test('an unedited document does not retain a copy of its contents in saved state', async () => {
  await expect(saveState({ lines: ['large document'], redoStack: [], undoStack: [] } as any, undefined)).resolves.toEqual({})
})
