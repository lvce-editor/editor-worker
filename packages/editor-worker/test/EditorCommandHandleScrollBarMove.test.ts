import { expect, test } from '@jest/globals'
import * as EditorCommandHandleScrollBarMove from '../src/parts/EditorCommand/EditorCommandHandleScrollBarMove.ts'

test('handleScrollBarMove - dragging the thumb updates the scroll position', async () => {
  const editor = {
    charWidth: 8,
    decorations: [],
    deltaX: 0,
    deltaY: 0,
    finalDeltaY: 100,
    handleOffset: 10,
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

  await expect(EditorCommandHandleScrollBarMove.handleScrollBarMove(editor, 50)).resolves.toMatchObject({
    deltaY: 50,
    maxLineY: 4,
    minLineY: 2,
    scrollBarY: 40,
  })
})

test('handleScrollBarMove - defaults missing handle offset to zero', async () => {
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

  await expect(EditorCommandHandleScrollBarMove.handleScrollBarMove(editor, 50)).resolves.toMatchObject({
    deltaY: 62.5,
    maxLineY: 5,
    minLineY: 3,
    scrollBarY: 50,
  })
})
