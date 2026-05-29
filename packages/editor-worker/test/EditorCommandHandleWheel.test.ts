import { expect, test } from '@jest/globals'
import * as EditorCommandHandleWheel from '../src/parts/EditorCommand/EditorCommandHandleWheel.ts'

test('handleWheel delegates to shared setDelta logic', async () => {
  const editor = {
    deltaX: 0,
    deltaY: 0,
    finalDeltaY: 100,
    height: 40,
    itemHeight: 20,
    lines: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    minimumSliderSize: 20,
    numberOfVisibleLines: 2,
    scrollBarHeight: 16,
  }

  await expect(EditorCommandHandleWheel.handleWheel(editor, 0, 0, 40)).resolves.toMatchObject({
    deltaY: 40,
    minLineY: 2,
  })
})
