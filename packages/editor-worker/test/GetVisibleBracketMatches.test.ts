import { expect, test } from '@jest/globals'
import { getBracketMatchPositions, getVisibleBracketMatches } from '../src/parts/GetVisibleBracketMatches/GetVisibleBracketMatches.ts'

const createEditor = (lines: readonly string[], selections: Uint32Array) =>
  ({
    charWidth: 8,
    deltaY: 0,
    differences: lines.map(() => 0),
    foldingRanges: [],
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    isMonospaceFont: true,
    itemHeight: 20,
    letterSpacing: 0,
    lines,
    maxLineY: lines.length,
    minLineY: 0,
    rowHeight: 20,
    selections,
    tabSize: 2,
    visibleLineIndices: lines.map((_, index) => index),
    width: 200,
  }) as any

test('getVisibleBracketMatches positions both brackets', async () => {
  const editor = createEditor(['(value)'], new Uint32Array([0, 0, 0, 0]))

  await expect(getVisibleBracketMatches(editor)).resolves.toEqual([
    { height: 20, width: 8, x: 0, y: 0 },
    { height: 20, width: 8, x: 48, y: 0 },
  ])
})

test('getVisibleBracketMatches positions multiline brackets', async () => {
  const editor = createEditor(['{', 'value', '}'], new Uint32Array([0, 0, 0, 0]))

  await expect(getVisibleBracketMatches(editor)).resolves.toEqual([
    { height: 20, width: 8, x: 0, y: 0 },
    { height: 20, width: 8, x: 0, y: 40 },
  ])
})

test('getVisibleBracketMatches hides matches outside the viewport', async () => {
  const editor = {
    ...createEditor(['{', 'value', '}'], new Uint32Array([0, 0, 0, 0])),
    visibleLineIndices: [0, 1],
  }

  await expect(getVisibleBracketMatches(editor)).resolves.toEqual([{ height: 20, width: 8, x: 0, y: 0 }])
})

test('getVisibleBracketMatches does not highlight brackets for a selection', async () => {
  const editor = createEditor(['(value)'], new Uint32Array([0, 0, 0, 7]))

  await expect(getVisibleBracketMatches(editor)).resolves.toEqual([])
})

test('getBracketMatchPositions reuses matches while the document and cursor are unchanged', () => {
  const lines = ['(value)']
  const selections = new Uint32Array([0, 0, 0, 0])

  const first = getBracketMatchPositions(lines, selections)
  const second = getBracketMatchPositions(lines, selections)

  expect(second).toBe(first)
})

test('getBracketMatchPositions invalidates cached matches when the cursor changes', () => {
  const lines = ['(value)', '[]']
  const selections = new Uint32Array([0, 0, 0, 0])

  const first = getBracketMatchPositions(lines, selections)
  selections[0] = 1
  selections[1] = 0
  selections[2] = 1
  selections[3] = 0
  const second = getBracketMatchPositions(lines, selections)

  expect(second).not.toBe(first)
  expect(second).toEqual([
    { columnIndex: 0, rowIndex: 1 },
    { columnIndex: 1, rowIndex: 1 },
  ])
})

test('getBracketMatchPositions invalidates cached matches when the document changes', () => {
  const selections = new Uint32Array([0, 0, 0, 0])

  const first = getBracketMatchPositions(['(value)'], selections)
  const second = getBracketMatchPositions(['[value]'], selections)

  expect(second).not.toBe(first)
  expect(second).toEqual([
    { columnIndex: 0, rowIndex: 0 },
    { columnIndex: 6, rowIndex: 0 },
  ])
})
