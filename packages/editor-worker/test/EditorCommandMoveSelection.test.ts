import { expect, test } from '@jest/globals'
import * as EditorCommandMoveSelection from '../src/parts/EditorCommand/EditorCommandMoveSelection.ts'

test('editorMoveSelection - uses editor selection anchor position', () => {
  const editorA = {
    selectionAnchorPosition: {
      columnIndex: 1,
      rowIndex: 0,
    },
    selections: new Uint32Array([0, 0, 0, 0]),
  }
  const editorB = {
    selectionAnchorPosition: {
      columnIndex: 2,
      rowIndex: 1,
    },
    selections: new Uint32Array([0, 0, 0, 0]),
  }

  const resultA = EditorCommandMoveSelection.editorMoveSelection(editorA, {
    columnIndex: 4,
    rowIndex: 0,
  })
  const resultB = EditorCommandMoveSelection.editorMoveSelection(editorB, {
    columnIndex: 5,
    rowIndex: 1,
  })

  expect(resultA.selections).toEqual(new Uint32Array([0, 1, 0, 4]))
  expect(resultB.selections).toEqual(new Uint32Array([1, 2, 1, 5]))
})
