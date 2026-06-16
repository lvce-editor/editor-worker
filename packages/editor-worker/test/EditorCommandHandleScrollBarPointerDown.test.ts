import { expect, test } from '@jest/globals'
import * as EditorCommandHandleScrollBarPointerDown from '../src/parts/EditorCommand/EditorCommandHandleScrollBarPointerDown.ts'

test('handleScrollBarPointerDown - clicking the track scrolls to the clicked position', async () => {
  const editor = {
    charWidth: 8,
    decorations: [],
    deltaX: 0,
    deltaY: 0,
    finalDeltaY: 100,
    height: 100,
    invalidStartIndex: 0,
    itemHeight: 20,
    languageId: '',
    lineCache: [],
    lines: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    minimumSliderSize: 20,
    numberOfVisibleLines: 2,
    scrollBarHeight: 20,
    tokenizerId: 0,
    width: 100,
    y: 0,
  }

  await expect(EditorCommandHandleScrollBarPointerDown.handleScrollBarPointerDown(editor, 50)).resolves.toMatchObject({
    deltaY: 50,
    handleOffset: 10,
    maxLineY: 4,
    minLineY: 2,
    scrollBarY: 40,
  })
})
