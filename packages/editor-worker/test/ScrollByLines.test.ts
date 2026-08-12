import { expect, test } from '@jest/globals'
import { scrollByLines } from '../src/parts/ScrollByLines/ScrollByLines.ts'

const createEditor = (deltaY: number) => ({
  charWidth: 8,
  decorations: [],
  deltaX: 0,
  deltaY,
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
})

test('scrolls down by editor lines', async () => {
  await expect(scrollByLines(createEditor(20) as any, 2)).resolves.toMatchObject({
    deltaY: 60,
    minLineY: 3,
  })
})

test('scrolls up by editor lines', async () => {
  await expect(scrollByLines(createEditor(60) as any, -2)).resolves.toMatchObject({
    deltaY: 20,
    minLineY: 1,
  })
})
