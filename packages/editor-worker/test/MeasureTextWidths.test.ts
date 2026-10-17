import { expect, jest, test } from '@jest/globals'

const measureTextWidthsSlow = jest.fn(
  async (
    texts: readonly string[],
    _fontWeight: number,
    _fontSize: number,
    _fontFamily: string,
    _letterSpacing: number,
    _isMonoSpaceFont: boolean,
    _charWidth: number,
  ) => texts.map((text) => text.length * 10),
)

jest.unstable_mockModule('../src/parts/MeasureTextWidthsSlow/MeasureTextWidthsSlow.ts', () => ({ measureTextWidthsSlow }))

const MeasureTextWidth = await import('../src/parts/MeasureTextWidth/MeasureTextWidth.ts')

test('keeps mixed fast and slow widths in their original positions', async () => {
  await expect(MeasureTextWidth.measureTextWidths(['abc', 'é', 'de'], 400, 16, 'test', 0, true, 2)).resolves.toEqual([6, 10, 4])
  expect(measureTextWidthsSlow).toHaveBeenCalledWith(['é'], 400, 16, 'test', 0, true, 2)
})

test('returns an empty array without invoking the measurement worker', async () => {
  measureTextWidthsSlow.mockClear()
  await expect(MeasureTextWidth.measureTextWidths([], 400, 16, 'test', 0, false, 8)).resolves.toEqual([])
  expect(measureTextWidthsSlow).not.toHaveBeenCalled()
})
