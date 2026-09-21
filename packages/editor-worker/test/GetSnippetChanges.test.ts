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
