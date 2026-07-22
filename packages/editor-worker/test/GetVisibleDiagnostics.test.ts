import { expect, test } from '@jest/globals'
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
