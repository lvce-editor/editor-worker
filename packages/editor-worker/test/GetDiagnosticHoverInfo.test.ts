import { afterEach, expect, jest, test } from '@jest/globals'

const measureTextBlockHeight = jest.fn<(...args: any[]) => Promise<number>>(async () => 40)

jest.unstable_mockModule('../src/parts/MeasureTextHeight/MeasureTextHeight.ts', () => ({
  measureTextBlockHeight,
}))

const GetDiagnosticHoverInfo = await import('../src/parts/GetDiagnosticHoverInfo/GetDiagnosticHoverInfo.ts')

const diagnostic = {
  code: 2322,
  columnIndex: 11,
  endColumnIndex: 17,
  endRowIndex: 12,
  message: "Type 'number' is not assignable to type 'string'.",
  rowIndex: 12,
  source: 'ts',
  type: 'error',
  uri: 'file:///test.ts',
}

const editor = {
  columnWidth: 10,
  deltaY: 200,
  fontFamily: 'Fira Code',
  fontSize: 15,
  height: 400,
  rowHeight: 20,
  width: 800,
  x: 0,
  y: 0,
}

afterEach(() => {
  measureTextBlockHeight.mockClear()
})

test('creates a diagnostic-only popup positioned from the current editor layout', async () => {
  await expect(GetDiagnosticHoverInfo.getDiagnosticHoverInfo(editor, diagnostic)).resolves.toEqual({
    diagnostics: [diagnostic],
    documentation: '',
    documentationVirtualDom: [],
    height: 50,
    lineInfos: [],
    width: 600,
    x: 110,
    y: 60,
  })
  expect(measureTextBlockHeight).toHaveBeenCalledWith("Type 'number' is not assignable to type 'string'. ts (2322)", 'Fira Code', 15, '20px', 582)
})

test('clamps diagnostic hover height when measured content exceeds the maximum', async () => {
  measureTextBlockHeight.mockResolvedValueOnce(400)

  await expect(GetDiagnosticHoverInfo.getDiagnosticHoverInfo(editor, diagnostic)).resolves.toEqual(
    expect.objectContaining({
      height: 300,
    }),
  )
})

test('measures diagnostic messages with explicit newlines intact', async () => {
  measureTextBlockHeight.mockResolvedValueOnce(60)

  await expect(
    GetDiagnosticHoverInfo.getDiagnosticHoverInfo(editor, {
      ...diagnostic,
      message: 'First diagnostic line\nSecond diagnostic line',
    }),
  ).resolves.toEqual(
    expect.objectContaining({
      height: 70,
    }),
  )
  expect(measureTextBlockHeight).toHaveBeenCalledWith('First diagnostic line\nSecond diagnostic line ts (2322)', 'Fira Code', 15, '20px', 582)
})

test('constrains diagnostic hover height to the editor viewport', async () => {
  measureTextBlockHeight.mockResolvedValueOnce(400)

  await expect(GetDiagnosticHoverInfo.getDiagnosticHoverInfo({ ...editor, height: 250 }, diagnostic)).resolves.toEqual(
    expect.objectContaining({
      height: 250,
    }),
  )
})
