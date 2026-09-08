import { expect, test } from '@jest/globals'
import { handleFocus } from '../src/parts/EditorCommand/EditorCommandHandleFocus.ts'
import { emptyEditor } from '../src/parts/EmptyEditor/EmptyEditor.ts'
import { getEditorVirtualDom } from '../src/parts/GetEditorVirtualDom/GetEditorVirtualDom.ts'
import { revealProblem } from '../src/parts/RevealProblem/RevealProblem.ts'

const editor = {
  ...emptyEditor,
  deltaY: 0,
  focused: true,
  foldingRanges: [],
  height: 40,
  highlightedLine: 0,
  itemHeight: 20,
  lines: ['first', 'second', 'third', 'fourth', 'fifth'],
  maxLineY: 2,
  minLineY: 0,
  numberOfVisibleLines: 2,
  selections: new Uint32Array([0, 0, 0, 0]),
}

test('reveals an offscreen problem without focusing or replacing the debug highlight', () => {
  const result = revealProblem(editor, 4, 2)
  expect(result.focused).toBe(false)
  expect(result.selections).toEqual(new Uint32Array([4, 2, 4, 2]))
  expect(result.problemsHighlightedRow).toBe(4)
  expect(result.highlightedLine).toBe(0)
  expect(result.minLineY).toBe(3)
})

test('unfolds the problem while preserving unrelated folds', () => {
  const result = revealProblem(
    {
      ...editor,
      foldingRanges: [
        { end: 2, start: 0 },
        { end: 4, start: 3 },
      ],
    },
    1,
    0,
  )
  expect(result.foldingRanges).toEqual([{ end: 4, start: 3 }])
  expect(result.selections).toEqual(new Uint32Array([1, 0, 1, 0]))
})

test('replaces a previous highlight and clears it when the editor gains focus', () => {
  const first = revealProblem(editor, 1, 0)
  const second = revealProblem(first, 2, 1)
  expect(second.problemsHighlightedRow).toBe(2)
  expect(handleFocus(second).problemsHighlightedRow).toBe(-1)
})

test('clamps stale diagnostic positions to the document', () => {
  const result = revealProblem(editor, 100, 100)
  expect(result.selections).toEqual(new Uint32Array([4, 5, 4, 5]))
  expect(revealProblem(editor, -1, -1).selections).toEqual(new Uint32Array([0, 0, 0, 0]))
  expect(revealProblem(editor, NaN, 0)).toBe(editor)
})

test('renders the problem highlight on the document row in a scrolled editor', () => {
  const dom = getEditorVirtualDom({
    differences: [0, 0],
    focused: false,
    highlightedLine: 3,
    problemsHighlightedRow: 4,
    textInfos: [
      ['fourth', 'Token'],
      ['fifth', 'Token'],
    ],
    uid: 1,
    visibleLineIndices: [3, 4],
  })
  expect(dom.filter((node) => node.className?.includes('EditorRow'))).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ className: 'EditorRow EditorRowHighlighted' }),
      expect.objectContaining({ className: 'EditorRow EditorProblemsHighlightedRow' }),
    ]),
  )
})
