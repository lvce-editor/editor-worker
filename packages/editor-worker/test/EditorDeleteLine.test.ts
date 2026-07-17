import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'

const mockRpc = MockRpc.create({
  commandMap: {},
  invoke: async () => {
    return undefined
  },
})
ExtensionHost.set(mockRpc)
RendererWorker.set(mockRpc)

import * as EditorDeleteLine from '../src/parts/EditorCommand/EditorCommandDeleteLine.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

const createEditor = (lines: string[], selections: Uint32Array) => ({
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

test('deleteLine - middle line', async () => {
  const editor = createEditor(['alpha', 'bravo', 'charlie'], EditorSelection.fromRange(1, 2, 1, 2))

  expect(await EditorDeleteLine.deleteLine(editor)).toMatchObject({
    lines: ['alpha', 'charlie'],
    selections: EditorSelection.fromRange(1, 2, 1, 2),
  })
})

test('deleteLine - first line', async () => {
  const editor = createEditor(['alpha', 'bravo'], EditorSelection.fromRange(0, 4, 0, 4))

  expect(await EditorDeleteLine.deleteLine(editor)).toMatchObject({
    lines: ['bravo'],
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
})

test('deleteLine - last line', async () => {
  const editor = createEditor(['alpha', 'bravo'], EditorSelection.fromRange(1, 3, 1, 3))

  expect(await EditorDeleteLine.deleteLine(editor)).toMatchObject({
    lines: ['alpha'],
    selections: EditorSelection.fromRange(0, 3, 0, 3),
  })
})

test('deleteLine - only line', async () => {
  const editor = createEditor(['alpha'], EditorSelection.fromRange(0, 3, 0, 3))

  expect(await EditorDeleteLine.deleteLine(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('deleteLine - empty document is unchanged', async () => {
  const editor = createEditor([''], EditorSelection.fromRange(0, 0, 0, 0))

  expect(await EditorDeleteLine.deleteLine(editor)).toBe(editor)
})

test('deleteLine - selection ending at start of line excludes final line', async () => {
  const editor = createEditor(['alpha', 'bravo', 'charlie'], EditorSelection.fromRange(0, 2, 2, 0))

  expect(await EditorDeleteLine.deleteLine(editor)).toMatchObject({
    lines: ['charlie'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('deleteLine - adjacent cursors merge into one operation', async () => {
  const editor = createEditor(['alpha', 'bravo', 'charlie', 'delta'], new Uint32Array([1, 2, 1, 2, 2, 4, 2, 4]))

  expect(await EditorDeleteLine.deleteLine(editor)).toMatchObject({
    lines: ['alpha', 'delta'],
    selections: EditorSelection.fromRange(1, 2, 1, 2),
  })
})

test('deleteLine - non-adjacent cursors delete both lines', async () => {
  const editor = createEditor(['alpha', 'bravo', 'charlie', 'delta', 'echo'], new Uint32Array([1, 2, 1, 2, 3, 3, 3, 3]))

  expect(await EditorDeleteLine.deleteLine(editor)).toMatchObject({
    lines: ['alpha', 'charlie', 'echo'],
    selections: new Uint32Array([1, 2, 1, 2, 2, 3, 2, 3]),
  })
})
