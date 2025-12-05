import { expect, test } from '@jest/globals'
import type { OffsetBasedEdit } from '../src/parts/OffsetBasedEdit/OffsetBasedEdit.ts'
import * as GetDocumentEdits from '../src/parts/GetDocumentEdits/GetDocumentEdits.ts'

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
