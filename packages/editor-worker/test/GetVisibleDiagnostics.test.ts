import { expect, test } from '@jest/globals'
import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import { getVisibleDiagnostics } from '../src/parts/GetVisibleDiagnostics/GetVisibleDiagnostics.ts'

test('renders a diagnostic on its reported row', async () => {
  const editor = {
    charWidth: 8,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    isMonospaceFont: true,
    letterSpacing: 0,
    lines: ['first', 'second'],
    minLineY: 0,
    rowHeight: 20,
    tabSize: 2,
    width: 800,
  }
  const diagnostics = [
    {
      code: 1,
      columnIndex: 0,
      endColumnIndex: 1,
      endRowIndex: 1,
      message: 'error',
      rowIndex: 1,
      source: 'test',
      type: 'error',
      uri: '/test.xyz',
    },
  ]

  await expect(getVisibleDiagnostics(editor, diagnostics)).resolves.toEqual([
    {
      height: 20,
      type: 'error',
      width: 8,
      x: 0,
      y: 20,
    },
  ])
})

test('renders a one-character highlight for an empty diagnostic range', async () => {
  const editor = {
    charWidth: 8,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    isMonospaceFont: true,
    letterSpacing: 0,
    lines: ['first', 'second'],
    minLineY: 0,
    rowHeight: 20,
    tabSize: 2,
    width: 800,
  }
  const diagnostics = [
    {
      code: 1,
      columnIndex: 2,
      endColumnIndex: 2,
      endRowIndex: 1,
      message: 'error',
      rowIndex: 1,
      source: 'eslint',
      type: 'error',
      uri: '/test.yml',
    },
  ]

  await expect(getVisibleDiagnostics(editor, diagnostics)).resolves.toEqual([
    {
      height: 20,
      type: 'error',
      width: 8,
      x: 16,
      y: 20,
    },
  ])
})

test('measures diagnostic width from the rendered text range', async () => {
  using _mockRpc = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.measureTextWidth'(text: string, _fontWeight: number, _fontSize: number, _fontFamily: string, letterSpacing: number) {
      const characterWidths: Record<string, number> = { W: 12, a: 5, i: 4 }
      const width = [...text].reduce((total, character) => total + (characterWidths[character] || 0), 0)
      return width + Math.max(0, text.length - 1) * letterSpacing
    },
  })
  const editor = {
    charWidth: 10,
    fontFamily: 'test font',
    fontSize: 14,
    fontWeight: 400,
    isMonospaceFont: false,
    letterSpacing: 1,
    lines: ['aWii'],
    minLineY: 0,
    rowHeight: 20,
    tabSize: 2,
    width: 800,
  }
  const diagnostics = [
    {
      code: 1,
      columnIndex: 1,
      endColumnIndex: 4,
      endRowIndex: 0,
      message: 'error',
      rowIndex: 0,
      source: 'test',
      type: 'error',
      uri: '/test.xyz',
    },
  ]

  await expect(getVisibleDiagnostics(editor, diagnostics)).resolves.toEqual([
    {
      height: 20,
      type: 'error',
      width: 23,
      x: 5,
      y: 0,
    },
  ])
})

test('measures diagnostic width across tabs', async () => {
  const editor = {
    charWidth: 8,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    isMonospaceFont: true,
    letterSpacing: 0,
    lines: ['a\tb'],
    minLineY: 0,
    rowHeight: 20,
    tabSize: 2,
    width: 800,
  }
  const diagnostics = [
    {
      code: 1,
      columnIndex: 0,
      endColumnIndex: 3,
      endRowIndex: 0,
      message: 'error',
      rowIndex: 0,
      source: 'test',
      type: 'error',
      uri: '/test.xyz',
    },
  ]

  await expect(getVisibleDiagnostics(editor, diagnostics)).resolves.toEqual([
    {
      height: 20,
      type: 'error',
      width: 32,
      x: 0,
      y: 0,
    },
  ])
})
