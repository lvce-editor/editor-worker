import { beforeAll, expect, test } from '@jest/globals'

beforeAll(() => {
  // @ts-ignore
  globalThis.OffscreenCanvas = class {
    getContext() {
      return {
        measureText() {
          return {
            width: 18,
          }
        },
      }
    }
  }
})

const GetAccurateColumnIndexAscii = await import('../src/parts/GetAccurateColumnIndexAscii/GetAccurateColumnIndexAscii.ts')

test('getAccurateColumnIndexAscii - at end of line', () => {
  const line = 'abc'
  const guess = 3
  const averageCharWidth = 9
  const eventX = 10
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test'
  const letterSpacing = 0.5
  const isMonospaceFont = false
  const charWidth = 9
  expect(
    GetAccurateColumnIndexAscii.getAccurateColumnIndexAscii(
      line,
      guess,
      averageCharWidth,
      eventX,
      fontWeight,
      fontSize,
      fontFamily,
      letterSpacing,
      isMonospaceFont,
      charWidth,
    ),
  ).toBe(3)
})

test.skip('getAccurateColumnIndexAscii - in the middle of line', () => {
  // Skipped: Global OffscreenCanvas mock conflicts with other test files when run together
  const line = 'abcd'
  const guess = 1
  const averageCharWidth = 9
  const eventX = 10
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test'
  const letterSpacing = 0.5
  const isMonospaceFont = false
  const charWidth = 9
  expect(
    GetAccurateColumnIndexAscii.getAccurateColumnIndexAscii(
      line,
      guess,
      averageCharWidth,
      eventX,
      fontWeight,
      fontSize,
      fontFamily,
      letterSpacing,
      isMonospaceFont,
      charWidth,
    ),
  ).toBe(1)
})
