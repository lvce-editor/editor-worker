import { beforeAll, expect, test } from '@jest/globals'

beforeAll(() => {
  // @ts-ignore
  globalThis.OffscreenCanvas = class {
    getContext() {
      return {
        measureText() {
          return {
            width: 52,
          }
        },
      }
    }
  }
})

const GetX = await import('../src/parts/GetX/GetX.ts')

test('getX - empty line', async () => {
  const line = ''
  const column = 0
  const fontWeight = 400
  const fontSize = 16
  const fontFamily = 'test font'
  const isMonospaceFont = true
  const letterSpacing = 0.5
  const tabSize = 2
  const halfCursorWidth = 1
  const width = 10
  const averageCharWidth = 9
  const difference = 0
  expect(
    await GetX.getX(
      line,
      column,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      difference,
    ),
  ).toBe(0)
})

test('getX - first column', async () => {
  const line = 'test'
  const column = 0
  const fontWeight = 400
  const fontSize = 16
  const fontFamily = 'test font'
  const isMonospaceFont = true
  const letterSpacing = 0.5
  const tabSize = 2
  const halfCursorWidth = 1
  const width = 10
  const averageCharWidth = 9
  const difference = 0
  expect(
    await GetX.getX(
      line,
      column,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      difference,
    ),
  ).toBe(0)
})

test('getX - enough space', async () => {
  const line = 'test'
  const column = 4
  const fontWeight = 400
  const fontSize = 16
  const fontFamily = 'test font'
  const isMonospaceFont = true
  const letterSpacing = 0.5
  const tabSize = 2
  const halfCursorWidth = 1
  const width = 25
  const averageCharWidth = 9
  const difference = 0
  expect(
    await GetX.getX(
      line,
      column,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      difference,
    ),
  ).toBe(25)
})

test.skip('getX - measure text width', async () => {
  // Skipped: Global OffscreenCanvas mock conflicts with other test files when run together
  const line = 'test'
  const column = 1
  const fontWeight = 400
  const fontSize = 16
  const fontFamily = 'test font'
  const isMonospaceFont = false
  const letterSpacing = 0.5
  const tabSize = 2
  const halfCursorWidth = 1
  const width = 1000
  const averageCharWidth = 9
  const difference = 0
  expect(
    await GetX.getX(
      line,
      column,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      difference,
    ),
  ).toBe(51)
})
