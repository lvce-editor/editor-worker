import { beforeEach, expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker, SyntaxHighlightingWorker, TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import * as Composition from '../src/parts/EditorCommand/EditorCommandComposition.ts'
import * as Redo from '../src/parts/EditorCommand/EditorCommandRedo.ts'
import * as Undo from '../src/parts/EditorCommand/EditorCommandUndo.ts'
import { emptyEditor } from '../src/parts/EmptyEditor/EmptyEditor.ts'

const rpc = MockRpc.create({ commandMap: {}, invoke: async () => undefined })
ExtensionHost.set(rpc)
RendererWorker.set(rpc)
SyntaxHighlightingWorker.set(MockRpc.create({ commandMap: {}, invoke: async () => [{}] }))
TextMeasurementWorker.set(MockRpc.create({ commandMap: {}, invoke: async (_method: string, text: string) => text.length * 8 }))

beforeEach(() => {
  Composition.state.compositionText = ''
  Composition.state.isComposing = false
})

const createEditor = () => ({
  ...emptyEditor,
  decorations: [],
  invalidStartIndex: 0,
  lineCache: [],
  lines: ['prefix'],
  modified: true,
  selections: new Uint32Array([0, 6, 0, 6]),
  undoStack: [],
})

test('ending unchanged composition preserves one undoable edit', async () => {
  const started = Composition.compositionStart(createEditor(), '')
  const updated = await Composition.compositionUpdate(started, '字')
  const committed = await Composition.compositionEnd(updated, '字')
  expect(committed.lines).toEqual(['prefix字'])
  expect(committed.undoStack).toHaveLength(1)
  expect(Composition.state.isComposing).toBe(false)
  expect(Composition.state.compositionText).toBe('')
  const undone = await Undo.undo(committed)
  expect(undone.lines).toEqual(['prefix'])
  const redone = await Redo.redo(undone)
  expect(redone.lines).toEqual(['prefix字'])
})

test('ending an empty composition leaves the document and undo history unchanged', async () => {
  const started = Composition.compositionStart(createEditor(), '')
  const committed = await Composition.compositionEnd(started, '')
  expect(committed).toBe(started)
  expect(committed.undoStack).toEqual([])
  expect(Composition.state.isComposing).toBe(false)
})

test('ending composition with a different final value still applies it', async () => {
  const started = Composition.compositionStart(createEditor(), '')
  const updated = await Composition.compositionUpdate(started, '字')
  const committed = await Composition.compositionEnd(updated, '語')
  expect(committed.lines).toEqual(['prefix語'])
  expect(Composition.state.isComposing).toBe(false)
  expect(Composition.state.compositionText).toBe('')
})
