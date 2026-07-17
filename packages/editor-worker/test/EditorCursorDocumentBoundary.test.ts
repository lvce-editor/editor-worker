import { expect, test } from '@jest/globals'
import * as CursorDocumentEnd from '../src/parts/EditorCommand/EditorCommandCursorDocumentEnd.ts'
import * as CursorDocumentStart from '../src/parts/EditorCommand/EditorCommandCursorDocumentStart.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

const createEditor = (selections: Uint32Array) => ({
  lineCache: [],
  lines: ['first', 'middle', 'last'],
  primarySelectionIndex: 0,
  selections,
})

test('cursorDocumentStart moves the cursor to the start of the document', () => {
  const editor = createEditor(EditorSelection.fromRange(1, 3, 1, 3))

  expect(CursorDocumentStart.cursorDocumentStart(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('cursorDocumentEnd moves the cursor to the end of the document', () => {
  const editor = createEditor(EditorSelection.fromRange(0, 3, 0, 3))

  expect(CursorDocumentEnd.cursorDocumentEnd(editor)).toMatchObject({
    selections: EditorSelection.fromRange(2, 4, 2, 4),
  })
})

test('document boundary movement collapses selections and multiple cursors', () => {
  const editor = createEditor(new Uint32Array([0, 1, 1, 4, 2, 2, 2, 2]))

  expect(CursorDocumentStart.cursorDocumentStart(editor)).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 0, 0, 0, 0, 0]),
  })
  expect(CursorDocumentEnd.cursorDocumentEnd(editor)).toMatchObject({
    selections: new Uint32Array([2, 4, 2, 4, 2, 4, 2, 4]),
  })
})
