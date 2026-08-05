import { afterEach, expect, jest, test } from '@jest/globals'
import * as Editors from '../src/parts/EditorStates/EditorStates.ts'

const getHover = jest.fn<(...args: any[]) => Promise<any>>()
const measureTextBlockHeight = jest.fn(async () => 20)
const tokenizeCodeBlock = jest.fn(async () => [])

jest.unstable_mockModule('../src/parts/Hover/Hover.ts', () => ({
  getHover,
}))

jest.unstable_mockModule('../src/parts/MeasureTextHeight/MeasureTextHeight.ts', () => ({
  measureTextBlockHeight,
}))

jest.unstable_mockModule('../src/parts/TokenizeCodeBlock/TokenizeCodeBlock.ts', () => ({
  tokenizeCodeBlock,
}))

const GetHoverInfo = await import('../src/parts/GetHoverInfo/GetHoverInfo.ts')

const diagnostic = {
  code: 'no-unused-vars',
  columnIndex: 6,
  endColumnIndex: 17,
  endRowIndex: 0,
  message: "'unusedValue' is assigned a value but never used.",
  rowIndex: 0,
  source: 'eslint',
  type: 'error',
  uri: 'file:///test.js',
}

const editor = {
  columnWidth: 10,
  diagnostics: [diagnostic],
  height: 400,
  lines: ['const unusedValue = 1'],
  rowHeight: 20,
  selections: [0, 0],
  uid: 1,
  x: 0,
  y: 0,
}

afterEach(() => {
  Editors.dispose(editor.uid)
  getHover.mockReset()
  measureTextBlockHeight.mockClear()
  tokenizeCodeBlock.mockClear()
})

test('returns diagnostic hover info when no language hover provider exists', async () => {
  getHover.mockRejectedValue(new Error('No hover provider found'))
  Editors.set(editor.uid, editor as any, editor as any)

  const result = await GetHoverInfo.getEditorHoverInfo(editor.uid, {
    columnIndex: 8,
    rowIndex: 0,
  })

  expect(result).toEqual({
    documentation: '',
    lineInfos: [],
    matchingDiagnostics: [diagnostic],
    x: 60,
    y: 420,
  })
  expect(tokenizeCodeBlock).not.toHaveBeenCalled()
})

test('returns no hover info outside the diagnostic range when no language hover exists', async () => {
  getHover.mockResolvedValue(undefined)
  Editors.set(editor.uid, editor as any, editor as any)

  const result = await GetHoverInfo.getEditorHoverInfo(editor.uid, {
    columnIndex: 2,
    rowIndex: 0,
  })

  expect(result).toBeUndefined()
})

test('matches a diagnostic on each covered row but excludes its end position', async () => {
  getHover.mockResolvedValue(undefined)
  const multilineDiagnostic = {
    ...diagnostic,
    columnIndex: 3,
    endColumnIndex: 4,
    endRowIndex: 1,
  }
  const multilineEditor = {
    ...editor,
    diagnostics: [multilineDiagnostic],
    lines: ['first line', 'second line'],
  }
  Editors.set(editor.uid, multilineEditor as any, multilineEditor as any)

  await expect(GetHoverInfo.getEditorHoverInfo(editor.uid, { columnIndex: 8, rowIndex: 0 })).resolves.toEqual(
    expect.objectContaining({ matchingDiagnostics: [multilineDiagnostic] }),
  )
  await expect(GetHoverInfo.getEditorHoverInfo(editor.uid, { columnIndex: 3, rowIndex: 1 })).resolves.toEqual(
    expect.objectContaining({ matchingDiagnostics: [multilineDiagnostic] }),
  )
  await expect(GetHoverInfo.getEditorHoverInfo(editor.uid, { columnIndex: 4, rowIndex: 1 })).resolves.toBeUndefined()
})
