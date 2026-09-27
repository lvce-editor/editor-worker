import { expect, test } from '@jest/globals'
import { updateLayout } from '../src/parts/EditorFolding/EditorFolding.ts'
import { getCss } from '../src/parts/GetCss/GetCss.ts'

const editor = {
  deltaY: 0,
  height: 60,
  itemHeight: 20,
  lines: Array.from({ length: 20 }, (_, index) => `line ${index + 1}`),
  minimumSliderSize: 20,
  numberOfVisibleLines: 3,
  rowHeight: 20,
}

test.each([
  [0, [0, 1, 2], 'none'],
  [7, [0, 1, 2, 3], '0px -7px'],
  [19, [0, 1, 2, 3], '0px -19px'],
  [20, [1, 2, 3], 'none'],
  [27, [1, 2, 3, 4], '0px -7px'],
])('pixel scroll %s renders the partially visible bottom row and offsets the wrappers', (deltaY, visibleLineIndices, translate) => {
  const state = updateLayout({ ...editor, deltaY }, [])
  expect(state.visibleLineIndices).toEqual(visibleLineIndices)
  const css = getCss(1, state.rowHeight, 20, 0, 20, 0, state.deltaY)
  expect(css).toContain(`.Editor[data-uid="1"] .EditorLayers {\n  height: calc(100% + var(--EditorRowHeight));\n  translate: ${translate};`)
  expect(css).toContain(`.Editor[data-uid="1"] .GutterRows {\n  flex: none;\n  width: 100%;\n  translate: ${translate};`)
})

test('pixel scrolling accounts for folded rows and a fractional viewport height', () => {
  const state = updateLayout({ ...editor, deltaY: 17, height: 65 }, [{ end: 3, start: 0 }])
  expect(state.visibleLineIndices).toEqual([0, 4, 5, 6, 7])
})

test('pixel scrolling keeps merge conflict actions in the same row flow', () => {
  const state = updateLayout(
    {
      ...editor,
      deltaY: 7,
      lines: ['one', '<<<<<<< HEAD', 'current', '=======', 'incoming', '>>>>>>> branch', 'last'],
      mergeConflictActionsEnabled: true,
    },
    [],
  )
  expect(state.visibleViewLineIndices).toEqual([0, -2, 1, 2])
})

test('the final pixel scroll position aligns the document bottom with the viewport', () => {
  const state = updateLayout({ ...editor, deltaY: 1000, height: 65 }, [])
  expect(state.finalDeltaY).toBe(335)
  expect(state.deltaY).toBe(335)
  expect(state.visibleLineIndices).toEqual([16, 17, 18, 19])
  expect(getCss(1, 20, 20, 0, 20, 0, state.deltaY)).toContain('translate: 0px -15px;')
})
