import { expect, test } from '@jest/globals'
import { setSelections } from '../src/parts/Editor/EditorSelection.ts'

const createEditor = () => ({
  deltaY: 0,
  finalDeltaY: 60,
  height: 40,
  itemHeight: 20,
  lines: ['a', 'b', 'c', 'd', 'e'],
  maxLineY: 2,
  minLineY: 0,
  numberOfVisibleLines: 2,
  primarySelectionIndex: 0,
  scrollBarHeight: 20,
})

test('reveals a selection below the viewport', () => {
  const selections = new Uint32Array([2, 0, 2, 0])
  expect(setSelections(createEditor(), selections)).toMatchObject({
    deltaY: 20,
    maxLineY: 3,
    minLineY: 1,
    selections,
  })
})

test('reveals a selection above the viewport', () => {
  const selections = new Uint32Array([0, 0, 0, 0])
  expect(
    setSelections(
      {
        ...createEditor(),
        deltaY: 40,
        maxLineY: 4,
        minLineY: 2,
      },
      selections,
    ),
  ).toMatchObject({
    deltaY: 0,
    maxLineY: 2,
    minLineY: 0,
    selections,
  })
})

test('skips hidden rows when moving into a folded range', () => {
  const selections = new Uint32Array([1, 0, 1, 0])
  expect(
    setSelections(
      {
        ...createEditor(),
        foldingRanges: [{ end: 3, start: 0 }],
        minimumSliderSize: 20,
        rowHeight: 20,
        selections: new Uint32Array([0, 0, 0, 0]),
      },
      selections,
    ),
  ).toMatchObject({
    selections: new Uint32Array([4, 0, 4, 0]),
  })
})
