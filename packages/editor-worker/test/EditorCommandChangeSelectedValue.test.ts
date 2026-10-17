import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker, SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'

const mockRpc = MockRpc.create({
  commandMap: {},
  invoke: async () => undefined,
})
ExtensionHost.set(mockRpc)
RendererWorker.set(mockRpc)
SyntaxHighlightingWorker.set(mockRpc)

import * as ChangeSelectedValue from '../src/parts/EditorCommand/EditorCommandChangeSelectedValue.ts'
import { emptyEditor } from '../src/parts/EmptyEditor/EmptyEditor.ts'

const createEditor = (lines: readonly string[], selections: Uint32Array): any => ({
  ...emptyEditor,
  initial: false,
  invalidStartIndex: 0,
  lines,
  modified: true,
  numberOfVisibleLines: 32,
  selections,
  uid: 1,
  uri: 'file:///test.txt',
})

test('increments the number under a cursor without moving the cursor', async () => {
  const editor = createEditor(['count = 41'], new Uint32Array([0, 9, 0, 9]))

  const newEditor = await ChangeSelectedValue.incrementSelection(editor)

  expect(newEditor.lines).toEqual(['count = 42'])
  expect(newEditor.selections).toEqual(new Uint32Array([0, 9, 0, 9]))
})

test('preserves a selected value when its length changes', async () => {
  const editor = createEditor(['9'], new Uint32Array([0, 0, 0, 1]))

  const newEditor = await ChangeSelectedValue.incrementSelection(editor)

  expect(newEditor.lines).toEqual(['10'])
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 0, 2]))
})

test('preserves a reversed selection', async () => {
  const editor = createEditor(['9'], new Uint32Array([0, 1, 0, 0]))

  const newEditor = await ChangeSelectedValue.incrementSelection(editor)

  expect(newEditor.lines).toEqual(['10'])
  expect(newEditor.selections).toEqual(new Uint32Array([0, 2, 0, 0]))
})

test('increments multiple values on the same line', async () => {
  const editor = createEditor(['1 9 3'], new Uint32Array([0, 0, 0, 0, 0, 2, 0, 2, 0, 4, 0, 4]))

  const newEditor = await ChangeSelectedValue.incrementSelection(editor)

  expect(newEditor.lines).toEqual(['2 10 4'])
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 0, 0, 0, 2, 0, 2, 0, 5, 0, 5]))
  expect(newEditor.undoStack).toHaveLength(1)
})

test('leaves unsupported cursors untouched while changing supported cursors', async () => {
  const editor = createEditor(['1', 'text'], new Uint32Array([0, 0, 0, 0, 1, 2, 1, 2]))

  const newEditor = await ChangeSelectedValue.incrementSelection(editor)

  expect(newEditor.lines).toEqual(['2', 'text'])
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 0, 0, 1, 2, 1, 2]))
})

test('returns the same editor when no selection contains a supported value', async () => {
  const editor = createEditor(['text'], new Uint32Array([0, 2, 0, 2]))

  expect(await ChangeSelectedValue.incrementSelection(editor)).toBe(editor)
})

test('returns the same editor when a color channel is already at its boundary', async () => {
  const editor = createEditor(['#ff0000'], new Uint32Array([0, 1, 0, 1]))

  expect(await ChangeSelectedValue.incrementSelection(editor)).toBe(editor)
})
