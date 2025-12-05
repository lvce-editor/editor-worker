import { expect, test } from '@jest/globals'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.ts'
import * as TextDocument from '../src/parts/TextDocument/TextDocument.ts'

test('applyEdits - one single line edit', () => {
  const textDocument = {
    lines: [''],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        deleted: [''],
        end: {
          columnIndex: 0,
          rowIndex: 0,
        },
        inserted: ['a'],
        start: {
          columnIndex: 0,
          rowIndex: 0,
        },
      },
    ]),
  ).toEqual(['a'])
})

test('applyEdits - one multi line edit', () => {
  const textDocument = {
    lines: ['line 1', 'line 2'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        deleted: ['ine 1', 'li'],
        end: {
          columnIndex: 2,
          rowIndex: 1,
        },
        inserted: ['a'],
        start: {
          columnIndex: 1,
          rowIndex: 0,
        },
      },
    ]),
  ).toEqual(['lane 2'])
})

test('applyEdits - new line inserted', () => {
  const textDocument = {
    lines: ['line 1', 'line 2'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        deleted: [''],
        end: {
          columnIndex: 0,
          rowIndex: 0,
        },
        inserted: ['', ''],
        start: {
          columnIndex: 0,
          rowIndex: 0,
        },
      },
    ]),
  ).toEqual(['', 'line 1', 'line 2'])
})

test('applyEdits - multiple new lines inserted', () => {
  const textDocument = {
    lines: ['line 1', 'line 2'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        deleted: [''],
        end: {
          columnIndex: 0,
          rowIndex: 0,
        },
        inserted: ['', '', '', ''],
        start: {
          columnIndex: 0,
          rowIndex: 0,
        },
      },
    ]),
  ).toEqual(['', '', '', 'line 1', 'line 2'])
})

test('applyEdits - virtual space insertion', () => {
  const textDocument = {
    lines: [''],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        deleted: [''],
        end: {
          columnIndex: 5,
          rowIndex: 0,
        },
        inserted: ['a'],
        start: {
          columnIndex: 5,
          rowIndex: 0,
        },
      },
    ]),
  ).toEqual(['     a'])
})

test('applyEdits - new line inserted in middle', () => {
  const textDocument = {
    lines: ['    11111', '22222'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        deleted: [''],
        end: {
          columnIndex: 2,
          rowIndex: 0,
        },
        inserted: ['', ''],
        origin: EditOrigin.InsertLineBreak,
        start: {
          columnIndex: 2,
          rowIndex: 0,
        },
      },
    ]),
  ).toEqual(['  ', '  11111', '22222'])
})

test('applyEdits - multiple insertions in one line', () => {
  const textDocument = {
    lines: ['  <body>', '    sample test', '  </body>'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        deleted: [''],
        end: { columnIndex: 4, rowIndex: 1 },
        inserted: ['<!--'],
        origin: EditOrigin.ToggleBlockComment,
        start: { columnIndex: 4, rowIndex: 1 },
      },
      {
        deleted: [''],
        end: { columnIndex: 20, rowIndex: 1 },
        inserted: ['-->'],
        origin: EditOrigin.ToggleBlockComment,
        start: { columnIndex: 20, rowIndex: 1 },
      },
    ]),
  ).toEqual(['  <body>', '    <!--sample test -->', '  </body>'])
})

test('applyEdits - single deletion in one line', () => {
  const textDocument = {
    lines: ['  <body>', '    <!--sample test-->', '  </body>'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        deleted: ['<!--'],
        end: { columnIndex: 8, rowIndex: 1 },
        inserted: [],
        origin: EditOrigin.ToggleBlockComment,
        start: { columnIndex: 4, rowIndex: 1 },
      },
    ]),
  ).toEqual(['  <body>', '    sample test-->', '  </body>'])
})

test('applyEdits - multiple deletions in one line', () => {
  const textDocument = {
    lines: ['  <body>', '    <!--sample test-->', '  </body>'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        deleted: ['<!--'],
        end: { columnIndex: 8, rowIndex: 1 },
        inserted: [''],
        origin: EditOrigin.ToggleBlockComment,
        start: { columnIndex: 4, rowIndex: 1 },
      },
      {
        deleted: ['-->'],
        end: { columnIndex: 18, rowIndex: 1 },
        inserted: [''],
        origin: EditOrigin.ToggleBlockComment,
        start: { columnIndex: 15, rowIndex: 1 },
      },
    ]),
  ).toEqual(['  <body>', '    sample test', '  </body>'])
})

test('applyEdits - deletions in multiple lines', () => {
  const textDocument = {
    lines: ['  <body>', '    <!--sample test', '-->', '  </body>'],
  }
  const edits = [
    {
      deleted: ['<!--'],
      end: { columnIndex: 8, rowIndex: 1 },
      inserted: [''],
      origin: EditOrigin.ToggleBlockComment,
      start: { columnIndex: 4, rowIndex: 1 },
    },
    {
      deleted: ['-->'],
      end: { columnIndex: 3, rowIndex: 2 },
      inserted: [''],
      origin: EditOrigin.ToggleBlockComment,
      start: { columnIndex: 0, rowIndex: 2 },
    },
  ]
  expect(TextDocument.applyEdits(textDocument, edits)).toEqual(['  <body>', '    sample test', '', '  </body>'])
})

test('positionAt - in first line', () => {
  expect(
    TextDocument.positionAt(
      {
        lines: ['11111', '22222'],
      },
      4,
    ),
  ).toEqual({
    columnIndex: 4,
    rowIndex: 0,
  })
})

test('positionAt - at end of first line', () => {
  expect(
    TextDocument.positionAt(
      {
        lines: ['11111', '22222'],
      },
      5,
    ),
  ).toEqual({
    columnIndex: 5,
    rowIndex: 0,
  })
})

test('positionAt - at start of second line', () => {
  expect(
    TextDocument.positionAt(
      {
        lines: ['11111', '22222'],
      },
      6,
    ),
  ).toEqual({
    columnIndex: 0,
    rowIndex: 1,
  })
})

test('applyEdits - issue with pasting many lines', () => {
  const textDocument = {
    lines: [''],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        deleted: [''],
        end: {
          columnIndex: 0,
          rowIndex: 0,
        },
        inserted: [...Array.from({ length: 150_000 }).fill('a')],
        start: {
          columnIndex: 0,
          rowIndex: 0,
        },
      },
    ]),
  ).toEqual([...Array.from({ length: 150_000 }).fill('a')])
})

test('applyEdits - virtual space', () => {
  const textDocument = {
    columnWidth: 9,
    cursor: {
      columnIndex: 6,
      rowIndex: 3,
    },
    deltaY: 0,
    finalDeltaY: 0,
    finalY: 0,
    fontSize: 15,
    height: 645,
    id: 1,
    languageId: 'plaintext',
    lines: ['line 1', 'line 2', 'line 3'],
    maxLineY: 3,
    minLineY: 0,
    numberOfVisibleLines: 32,
    rowHeight: 20,
    selections: [
      {
        end: {
          columnIndex: 6,
          rowIndex: 3,
        },
        start: {
          columnIndex: 0,
          rowIndex: 0,
        },
      },
    ],
    uri: '/test/test.txt',
    x: 0,
    y: 55,
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        deleted: ['line 1', 'line 2', 'line 3'],
        end: {
          columnIndex: 6,
          rowIndex: 3,
        },
        inserted: ['line 1,line 2,line 3'],
        origin: EditOrigin.EditorPasteText,
        start: {
          columnIndex: 0,
          rowIndex: 0,
        },
      },
    ]),
  ).toEqual(['line 1,line 2,line 3'])
})

test('applyEdits - issue with inserting multiple lines', () => {
  const editor = {
    completionTriggerCharacters: [],
    cursor: {
      columnIndex: 6,
      rowIndex: 3,
    },
    deltaY: 0,
    finalDeltaY: 0,
    finalY: 0,
    height: 645,
    id: 1,
    invalidStartIndex: 3,
    languageId: 'plaintext',
    lines: ['line 1', 'line 2', 'line 3'],
    maxLineY: 3,
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: [
      {
        end: {
          columnIndex: 6,
          rowIndex: 3,
        },
        start: {
          columnIndex: 0,
          rowIndex: 0,
        },
      },
    ],
    undoStack: [],
    uri: '/test/test.txt',
    validLines: [],
    x: 0,
    y: 55,
  }
  expect(
    TextDocument.applyEdits(editor, [
      {
        deleted: ['line 1', 'line 2', 'line 3'],
        end: { columnIndex: 6, rowIndex: 3 },
        inserted: ['line 1', 'line 2', 'line 3'],
        origin: EditOrigin.EditorPasteText,
        start: { columnIndex: 0, rowIndex: 0 },
      },
    ]),
  ).toEqual(['line 1', 'line 2', 'line 3'])
})

test('applyEdits - insert multiline snippet', () => {
  const editor = {
    cursor: {
      columnIndex: 2,
      rowIndex: 0,
    },
    lines: ['  '],
    selections: [
      {
        end: {
          columnIndex: 2,
          rowIndex: 0,
        },
        start: {
          columnIndex: 2,
          rowIndex: 0,
        },
      },
    ],
    undoStack: [],
  }
  const newLines = TextDocument.applyEdits(editor, [
    {
      deleted: [''],
      end: {
        columnIndex: 2,
        rowIndex: 0,
      },
      inserted: ['<div>', '    test', '  </div>'],
      origin: EditOrigin.EditorSnippet,
      start: {
        columnIndex: 2,
        rowIndex: 0,
      },
    },
  ])
  expect(newLines).toEqual(['  <div>', '    test', '  </div>'])
})

test('applyEdits - replace multiple lines', () => {
  const editor = {
    cursor: {
      columnIndex: 2,
      rowIndex: 0,
    },
    lines: ['h1 {', '  font-size: 20px', '}'],
    selections: [
      {
        end: {
          columnIndex: 2,
          rowIndex: 0,
        },
        start: {
          columnIndex: 2,
          rowIndex: 0,
        },
      },
    ],
    undoStack: [],
  }
  const newLines = TextDocument.applyEdits(editor, [
    {
      deleted: ['h1 {', '  font-size: 20px', '}'],
      end: {
        columnIndex: 0,
        rowIndex: 3,
      },
      inserted: ['h1 {', '  font-size: 20px;', '}', ''],
      origin: EditOrigin.Format,
      start: {
        columnIndex: 0,
        rowIndex: 0,
      },
    },
  ])
  expect(newLines).toEqual(['h1 {', '  font-size: 20px;', '}', ''])
})

test('applyEdits - replace multiple lines', () => {
  const editor = {
    cursor: {
      columnIndex: 2,
      rowIndex: 0,
    },
    lines: ['h1 {', '  font-size: 20px', '}'],
    selections: [
      {
        end: {
          columnIndex: 2,
          rowIndex: 0,
        },
        start: {
          columnIndex: 2,
          rowIndex: 0,
        },
      },
    ],
    undoStack: [],
  }
  const newLines = TextDocument.applyEdits(editor, [
    {
      deleted: ['h1 {', '  font-size: 20px', '}'],
      end: {
        columnIndex: 0,
        rowIndex: 3,
      },
      inserted: ['h1 {', '  font-size: 20px;', '}', ''],
      origin: EditOrigin.Format,
      start: {
        columnIndex: 0,
        rowIndex: 0,
      },
    },
  ])
  expect(newLines).toEqual(['h1 {', '  font-size: 20px;', '}', ''])
})

test('applyEdits - two lines deleted and two lines inserted', () => {
  const editor = {
    cursor: {
      columnIndex: 0,
      rowIndex: 0,
    },
    lines: ['b', 'a', ''],
    selections: [
      {
        end: {
          columnIndex: 0,
          rowIndex: 0,
        },
        start: {
          columnIndex: 0,
          rowIndex: 0,
        },
      },
    ],
    undoStack: [],
  }
  const newLines = TextDocument.applyEdits(editor, [
    {
      deleted: ['b', ''],
      end: {
        columnIndex: 0,
        rowIndex: 1,
      },
      inserted: ['a', 'b', ''],
      origin: EditOrigin.Unknown,
      start: {
        columnIndex: 0,
        rowIndex: 0,
      },
    },
    {
      deleted: ['a', ''],
      end: {
        columnIndex: 0,
        rowIndex: 2,
      },
      inserted: [''],
      origin: EditOrigin.Unknown,
      start: {
        columnIndex: 0,
        rowIndex: 1,
      },
    },
  ])
  expect(newLines).toEqual(['a', 'b', ''])
})

test('applyEdits - one line replaced by two', () => {
  const editor = {
    cursor: {
      columnIndex: 0,
      rowIndex: 0,
    },
    lines: [`import 'b'`],
    selections: [],
    undoStack: [],
  }
  const edits: readonly any[] = [
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
  ]
  const newLines = TextDocument.applyEdits(editor, edits)
  expect(newLines).toEqual([`import 'a'`, `import 'b'`, ''])
})

test('applyEdits - one line deleted', () => {
  const editor = {
    cursor: {
      columnIndex: 0,
      rowIndex: 0,
    },
    lines: [`b`],
    selections: [],
    undoStack: [],
  }
  const edits: readonly any[] = [
    {
      deleted: ['b', ''],
      end: {
        columnIndex: 0,
        rowIndex: 1,
      },
      inserted: [''],
      origin: 'format',
      start: {
        columnIndex: 0,
        rowIndex: 0,
      },
    },
  ]
  const newLines = TextDocument.applyEdits(editor, edits)
  expect(newLines).toEqual([''])
})

test('applyEdits - multiple document edits', () => {
  const editor = {
    cursor: {
      columnIndex: 0,
      rowIndex: 0,
    },
    lines: [`import 'b'`, `import 'a'`, ``, `let   x = 1`, ``, ``, ``, `export {}`],
    selections: [],
    undoStack: [],
  }
  const edits: readonly any[] = [
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
  ]
  const newLines = TextDocument.applyEdits(editor, edits)
  expect(newLines).toEqual(["import 'a'", "import 'b'", '', 'let   x = 1', '', '', '', 'export { }', ''])
})
