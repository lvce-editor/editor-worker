import { expect, test } from '@jest/globals'
import { fold } from '../src/parts/EditorCommand/EditorCommandFold.ts'
import { unfold } from '../src/parts/EditorCommand/EditorCommandUnfold.ts'

const createEditor = () => ({
  deltaY: 0,
  finalDeltaY: 0,
  foldingRanges: [],
  height: 100,
  itemHeight: 20,
  lines: ['function run() {', '  first()', '  second()', '}', 'after()'],
  minimumSliderSize: 20,
  numberOfVisibleLines: 5,
  primarySelectionIndex: 0,
  rowHeight: 20,
  selections: new Uint32Array([1, 2, 1, 2]),
})

test('folds and unfolds the current brace range without changing document lines', () => {
  const editor = createEditor()
  const folded = fold(editor)
  expect(folded).toMatchObject({
    foldingRanges: [{ end: 3, start: 0 }],
    lines: editor.lines,
    selections: new Uint32Array([0, 2, 0, 2]),
    visibleLineIndices: [0, 4],
  })
  expect(unfold(folded)).toMatchObject({
    foldingRanges: [],
    lines: editor.lines,
    visibleLineIndices: [0, 1, 2, 3, 4],
  })
})

test('preserves selections outside the folded range', () => {
  const editor = {
    ...createEditor(),
    selections: new Uint32Array([1, 2, 1, 2, 4, 1, 4, 1]),
  }
  expect(fold(editor)).toMatchObject({
    selections: new Uint32Array([0, 2, 0, 2, 4, 1, 4, 1]),
  })
})
