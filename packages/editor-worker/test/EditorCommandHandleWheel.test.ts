import { expect, test } from '@jest/globals'
import * as EditorCommandHandleWheel from '../src/parts/EditorCommand/EditorCommandHandleWheel.ts'

test('handleWheel delegates to shared setDelta logic', async () => {
  const editor = {
    charWidth: 8,
    decorations: [],
    deltaX: 0,
    deltaY: 0,
    finalDeltaY: 100,
    height: 40,
    invalidStartIndex: 0,
    itemHeight: 20,
    languageId: '',
    lineCache: [],
    lines: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    minimumSliderSize: 20,
    numberOfVisibleLines: 2,
    scrollBarHeight: 16,
    tokenizerId: 0,
    width: 100,
  }

  await expect(EditorCommandHandleWheel.handleWheel(editor, 0, 0, 40)).resolves.toMatchObject({
    deltaY: 40,
    minLineY: 2,
  })
})

test('handleWheel applies horizontal and vertical deltas together', async () => {
  const editor = {
    charWidth: 8,
    decorations: [],
    deltaX: 0,
    deltaY: 0,
    finalDeltaY: 100,
    height: 40,
    invalidStartIndex: 0,
    itemHeight: 20,
    languageId: '',
    lineCache: [],
    lines: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    minimumSliderSize: 20,
    numberOfVisibleLines: 2,
    scrollBarHeight: 16,
    tokenizerId: 0,
    width: 100,
  }

  await expect(EditorCommandHandleWheel.handleWheel(editor, 0, 16, 40)).resolves.toMatchObject({
    deltaX: 16,
    deltaY: 40,
    minLineY: 2,
  })
})
