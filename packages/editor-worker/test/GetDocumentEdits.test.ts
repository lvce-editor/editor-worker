import { expect, test } from '@jest/globals'
import type { OffsetBasedEdit } from '../src/parts/OffsetBasedEdit/OffsetBasedEdit.ts'
import * as GetDocumentEdits from '../src/parts/GetDocumentEdits/GetDocumentEdits.ts'
import * as TextDocument from '../src/parts/TextDocument/TextDocument.ts'

test('multiple edits', () => {
  const edits: readonly OffsetBasedEdit[] = [
    {
      endOffset: 11,
      inserted: "import 'a'\nimport 'b'\n",
      startOffset: 0,
    },
    {
      endOffset: 22,
      inserted: '',
      startOffset: 11,
    },
    {
      endOffset: 47,
      inserted: 'export { }\n',
      startOffset: 38,
    },
  ]
  const editor = {
    lines: [`import 'b'`, `import 'a'`, ``, `let   x = 1`, ``, ``, ``, `export {}`],
  }
  expect(GetDocumentEdits.getDocumentEdits(editor, edits)).toEqual([
    {
      deleted: ["import 'b'", ''],
      end: {
        columnIndex: 0,
        rowIndex: 1,
      },
      inserted: ["import 'a'", "import 'b'", ''],
      origin: 'format',
      start: {
        columnIndex: 0,
        rowIndex: 0,
      },
    },
    {
      deleted: ["import 'a'", ''],
      end: {
        columnIndex: 0,
        rowIndex: 2,
      },
      inserted: [''],
      origin: 'format',
      start: {
        columnIndex: 0,
        rowIndex: 1,
      },
    },
    {
      deleted: ['export {}'],
      end: {
        columnIndex: 9,
        rowIndex: 7,
      },
      inserted: ['export { }', ''],
      origin: 'format',
      start: {
        columnIndex: 0,
        rowIndex: 7,
      },
    },
  ])
})

test('multiple insertions use offsets from the original document', () => {
  const editor = {
    lines: ['module Format exposing (main)', 'import Html exposing (Html,text)', 'main:Html msg', 'main=Html.div [] [text "Hello"]'],
  }
  const edits: readonly OffsetBasedEdit[] = [
    { endOffset: 30, inserted: '\n', startOffset: 30 },
    { endOffset: 57, inserted: ' ', startOffset: 57 },
    { endOffset: 62, inserted: '\n\n', startOffset: 62 },
    { endOffset: 67, inserted: ' ', startOffset: 67 },
    { endOffset: 68, inserted: ' ', startOffset: 68 },
    { endOffset: 81, inserted: ' ', startOffset: 81 },
    { endOffset: 82, inserted: '\n    ', startOffset: 82 },
    { endOffset: 95, inserted: ' ', startOffset: 95 },
    { endOffset: 107, inserted: ' ', startOffset: 107 },
  ]

  const documentEdits = GetDocumentEdits.getDocumentEdits(editor, edits)
  expect(TextDocument.applyEdits(editor, documentEdits)).toEqual([
    'module Format exposing (main)',
    '',
    'import Html exposing (Html, text)',
    '',
    '',
    'main : Html msg',
    'main =',
    '    Html.div [] [ text "Hello" ]',
  ])
})
