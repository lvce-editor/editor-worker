import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'

const mockRpc = MockRpc.create({
  commandMap: {},
  invoke: async () => undefined,
})
ExtensionHost.set(mockRpc)
RendererWorker.set(mockRpc)

import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as MoveLineDown from '../src/parts/MoveLineDown/MoveLineDown.ts'
import * as MoveLineUp from '../src/parts/MoveLineUp/MoveLineUp.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

const createEditor = (selections: Uint32Array, lines = ['alpha', 'bravo', 'charlie', 'delta']) => ({
  decorations: [],
  invalidStartIndex: 0,
  lineCache: [],
  lines,
  minLineY: 0,
  numberOfVisibleLines: 32,
  primarySelectionIndex: 0,
  selections,
  tokenizer: TokenizePlainText,
  undoStack: [],
})

test('moveLineDown - moves the active line and cursor down', async () => {
  const editor = createEditor(EditorSelection.fromRange(0, 2, 0, 2))

  expect(await MoveLineDown.moveLineDown(editor)).toMatchObject({
    lines: ['bravo', 'alpha', 'charlie', 'delta'],
    selections: EditorSelection.fromRange(1, 2, 1, 2),
  })
})

test('moveLineDown - last line is unchanged', () => {
  const editor = createEditor(EditorSelection.fromRange(3, 2, 3, 2))

  expect(MoveLineDown.moveLineDown(editor)).toBe(editor)
})

test('moveLineUp - moves the active line and cursor up', async () => {
  const editor = createEditor(EditorSelection.fromRange(2, 3, 2, 3))

  expect(await MoveLineUp.moveLineUp(editor)).toMatchObject({
    lines: ['alpha', 'charlie', 'bravo', 'delta'],
    selections: EditorSelection.fromRange(1, 3, 1, 3),
  })
})

test('moveLineUp - first line is unchanged', () => {
  const editor = createEditor(EditorSelection.fromRange(0, 2, 0, 2))

  expect(MoveLineUp.moveLineUp(editor)).toBe(editor)
})

test('moveLineDown - moves a multi-line selection as a block', async () => {
  const editor = createEditor(EditorSelection.fromRange(0, 1, 1, 3))

  expect(await MoveLineDown.moveLineDown(editor)).toMatchObject({
    lines: ['charlie', 'alpha', 'bravo', 'delta'],
    selections: EditorSelection.fromRange(1, 1, 2, 3),
  })
})

test('moveLineDown - excludes a selection end at the start of the following line', async () => {
  const editor = createEditor(EditorSelection.fromRange(0, 2, 2, 0))

  expect(await MoveLineDown.moveLineDown(editor)).toMatchObject({
    lines: ['charlie', 'alpha', 'bravo', 'delta'],
    selections: EditorSelection.fromRange(1, 2, 3, 0),
  })
})

test('moveLineDown - keeps a full-line selection valid when moving to the end of the document', async () => {
  const editor = createEditor(EditorSelection.fromRange(2, 0, 3, 0))

  expect(await MoveLineDown.moveLineDown(editor)).toMatchObject({
    lines: ['alpha', 'bravo', 'delta', 'charlie'],
    selections: EditorSelection.fromRange(3, 0, 3, 7),
  })
})

test('moveLineUp - preserves a reversed partial-line selection', async () => {
  const editor = createEditor(EditorSelection.fromRange(2, 2, 1, 1))

  expect(await MoveLineUp.moveLineUp(editor)).toMatchObject({
    lines: ['bravo', 'charlie', 'alpha', 'delta'],
    selections: EditorSelection.fromRange(1, 2, 0, 1),
  })
})

test('moveLineDown - preserves blank and indented lines', async () => {
  const editor = createEditor(EditorSelection.fromRange(0, 0, 0, 0), ['', '  indented', 'omega'])

  expect(await MoveLineDown.moveLineDown(editor)).toMatchObject({
    lines: ['  indented', '', 'omega'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('moveLineDown - collapses multiple selections to the primary moved selection', async () => {
  const editor = createEditor(new Uint32Array([0, 1, 0, 1, 2, 2, 2, 2]))

  expect(await MoveLineDown.moveLineDown(editor)).toMatchObject({
    lines: ['bravo', 'alpha', 'charlie', 'delta'],
    selections: EditorSelection.fromRange(1, 1, 1, 1),
  })
})

test('moveLineDown - moves the indexed primary selection', async () => {
  const editor = {
    ...createEditor(new Uint32Array([0, 1, 0, 1, 1, 2, 1, 2])),
    primarySelectionIndex: 4,
  }

  expect(await MoveLineDown.moveLineDown(editor)).toMatchObject({
    lines: ['alpha', 'charlie', 'bravo', 'delta'],
    selections: EditorSelection.fromRange(2, 2, 2, 2),
  })
})
