import { expect, test } from '@jest/globals'
import * as GetSnippetChanges from '../src/parts/GetSnippetChanges/GetSnippetChanges.ts'

test.each([
  { abbreviation: 'link', column: 33, inserted: '<link rel="stylesheet" href="$0">' },
  { abbreviation: 'h1', column: 8, inserted: '<h1>$0</h1>' },
  { abbreviation: 'br', column: 8, inserted: '<br>$0' },
  { abbreviation: 'div', column: 4, inserted: '$0<div></div>' },
])('places the cursor at the placeholder for $abbreviation', ({ abbreviation, column, inserted }) => {
  const lines = ['<head>', `    ${abbreviation}`, '</head>']
  const endColumn = 4 + abbreviation.length
  const result = GetSnippetChanges.getSnippetChanges(lines, new Uint32Array([1, endColumn, 1, endColumn]), {
    deleted: abbreviation.length,
    inserted,
  })
  expect(result.selectionChanges).toEqual(new Uint32Array([1, column, 1, column]))
  expect(result.changes).toEqual([
    expect.objectContaining({
      end: { columnIndex: endColumn, rowIndex: 1 },
      inserted: [inserted.replace('$0', '')],
      start: { columnIndex: 4, rowIndex: 1 },
    }),
  ])
})

test('places a multiline placeholder after applied indentation', () => {
  const lines = ['first', '  <head>', '  !', '  </head>']
  const result = GetSnippetChanges.getSnippetChanges(lines, new Uint32Array([2, 3, 2, 3]), {
    deleted: 1,
    inserted: '<body>\n  <section>$0</section>\n</body>',
  })
  expect(result.selectionChanges).toEqual(new Uint32Array([3, 13, 3, 13]))
  expect(result.changes).toEqual([
    expect.objectContaining({
      end: { columnIndex: 3, rowIndex: 2 },
      inserted: ['<body>', '    <section></section>', '  </body>'],
      start: { columnIndex: 2, rowIndex: 2 },
    }),
  ])
})

test('keeps the existing end position for multiline snippets without a placeholder', () => {
  const lines = ['  !']
  const result = GetSnippetChanges.getSnippetChanges(lines, new Uint32Array([0, 3, 0, 3]), {
    deleted: 1,
    inserted: '<html>\n</html>',
  })
  expect(result.selectionChanges).toEqual(new Uint32Array([1, 10, 1, 10]))
  expect(result.changes[0].inserted).toEqual(['<html>', '  </html>'])
})
