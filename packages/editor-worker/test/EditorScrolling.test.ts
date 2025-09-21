import { expect, test } from '@jest/globals'
import * as EditorScrolling from '../src/parts/EditorScrolling/EditorScrolling.ts'

test.skip('setDeltaY - same value', async () => {
  const editor = {
    finalDeltaY: 0,
    deltaY: 0,
    numberOfVisibleLines: 0,
    height: 0,
    scrollBarHeight: 0,
    itemHeight: 0,
    lineCache: [],
  }
  const value = 0
  expect(await EditorScrolling.setDeltaY(editor, value)).toBe(editor)
})

test.skip('setDeltaY - scroll down', async () => {
  const editor = {
    finalDeltaY: 400,
    deltaY: 1,
    numberOfVisibleLines: 20,
    height: 400,
    scrollBarHeight: 0,
    itemHeight: 20,
    lineCache: [],
  }
  const value = 100
  expect(await EditorScrolling.setDeltaY(editor, value)).toEqual({
    finalDeltaY: 400,
    numberOfVisibleLines: 20,
    height: 400,
    scrollBarHeight: 0,
    itemHeight: 20,
    deltaY: 100,
    maxLineY: 25,
    minLineY: 5,
    scrollBarY: 100,
    lineCache: [],
  })
})
