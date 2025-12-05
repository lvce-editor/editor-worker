import { expect, test } from '@jest/globals'
import * as EditorScrolling from '../src/parts/EditorScrolling/EditorScrolling.ts'

test.skip('setDeltaY - same value', async () => {
  const editor = {
    deltaY: 0,
    finalDeltaY: 0,
    height: 0,
    itemHeight: 0,
    lineCache: [],
    numberOfVisibleLines: 0,
    scrollBarHeight: 0,
  }
  const value = 0
  expect(await EditorScrolling.setDeltaY(editor, value)).toBe(editor)
})

test.skip('setDeltaY - scroll down', async () => {
  const editor = {
    deltaY: 1,
    finalDeltaY: 400,
    height: 400,
    itemHeight: 20,
    lineCache: [],
    numberOfVisibleLines: 20,
    scrollBarHeight: 0,
  }
  const value = 100
  expect(await EditorScrolling.setDeltaY(editor, value)).toEqual({
    deltaY: 100,
    finalDeltaY: 400,
    height: 400,
    itemHeight: 20,
    lineCache: [],
    maxLineY: 25,
    minLineY: 5,
    numberOfVisibleLines: 20,
    scrollBarHeight: 0,
    scrollBarY: 100,
  })
})
