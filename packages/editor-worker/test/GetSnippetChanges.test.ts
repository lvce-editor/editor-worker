import { expect, test } from '@jest/globals'
import * as GetSnippetChanges from '../src/parts/GetSnippetChanges/GetSnippetChanges.ts'

test.each([
  { abbreviation: 'link', inserted: '<link rel="stylesheet" href="$0">', column: 33 },
  { abbreviation: 'h1', inserted: '<h1>$0</h1>', column: 8 },
  { abbreviation: 'br', inserted: '<br>$0', column: 8 },
  { abbreviation: 'div', inserted: '$0<div></div>', column: 4 },
])('places the cursor at the placeholder for $abbreviation', ({ abbreviation, inserted, column }) => {
  const lines = ['<head>', `    ${abbreviation}`, '</head>']
  const endColumn = 4 + abbreviation.length
  const result = GetSnippetChanges.getSnippetChanges(lines, new Uint32Array([1, endColumn, 1, endColumn]), {
    deleted: abbreviation.length,
    inserted,
  })
  expect(result.selectionChanges).toEqual(new Uint32Array([1, column, 1, column]))
  expect(result.changes).toEqual([
    expect.objectContaining({
      start: { rowIndex: 1, columnIndex: 4 },
      end: { rowIndex: 1, columnIndex: endColumn },
      inserted: [inserted.replace('$0', '')],
    }),
  ])
})
