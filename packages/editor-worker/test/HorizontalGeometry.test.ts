import { expect, test } from '@jest/globals'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import { getVisibleDiagnostics } from '../src/parts/GetVisibleDiagnostics/GetVisibleDiagnostics.ts'

const createEditor = (deltaX = 500.5) => ({
  charWidth: 8,
  cursorWidth: 2,
  deltaX,
  deltaY: 0,
  differences: [-4.5],
  focused: true,
  fontFamily: 'monospace',
  fontSize: 14,
  fontWeight: 400,
  isMonospaceFont: true,
  itemHeight: 20,
  letterSpacing: 0,
  lines: ['a'.repeat(1000)],
  maxLineY: 1,
  minLineY: 0,
  rowHeight: 20,
  selections: new Uint32Array([0, 70, 0, 70]),
  tabSize: 4,
  visibleLineIndices: [0],
  width: 400,
})

const diagnostic = {
  columnIndex: 70,
  endColumnIndex: 73,
  endRowIndex: 0,
  rowIndex: 0,
  type: 'error',
}

test('a cursor uses its full source column and fractional scroll offset', async () => {
  await expect(EditorSelection.getVisible(createEditor())).resolves.toEqual({
    cursorInfos: ['58.5px 0px'],
    selectionInfos: [],
  })
})

test('diagnostics retain their measured width while scrolling', async () => {
  const before = await getVisibleDiagnostics(createEditor(), [diagnostic] as any)
  const after = await getVisibleDiagnostics(createEditor(501), [diagnostic] as any)
  expect(before).toEqual([{ height: 20, type: 'error', width: 24, x: 59.5, y: 0 }])
  expect(after).toEqual([{ height: 20, type: 'error', width: 24, x: 59, y: 0 }])
})

test('a diagnostic before the visible source range remains outside the viewport', async () => {
  await expect(getVisibleDiagnostics(createEditor(), [{ ...diagnostic, columnIndex: 0, endColumnIndex: 1 }] as any)).resolves.toEqual([
    { height: 20, type: 'error', width: 8, x: -500.5, y: 0 },
  ])
})

test('scrolled diagnostic coordinates measure a tab-expanded source prefix', async () => {
  const editor = { ...createEditor(8.5), lines: ['\txy'] }
  await expect(getVisibleDiagnostics(editor, [{ ...diagnostic, columnIndex: 2, endColumnIndex: 3 }] as any)).resolves.toEqual([
    { height: 20, type: 'error', width: 8, x: 31.5, y: 0 },
  ])
})
