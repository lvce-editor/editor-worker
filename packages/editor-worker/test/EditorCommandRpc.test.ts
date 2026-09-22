import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker, SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'

const rpc = MockRpc.create({ commandMap: {}, invoke: async () => undefined })
ExtensionHost.set(rpc)
RendererWorker.set(rpc)
SyntaxHighlightingWorker.set(MockRpc.create({ commandMap: {}, invoke: async () => [{}] }))

import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { emptyEditor } from '../src/parts/EmptyEditor/EmptyEditor.ts'

test('editor mutation RPC acknowledges completion without returning document history', async () => {
  const uid = 71
  const editor = {
    ...emptyEditor,
    initial: false,
    invalidStartIndex: 0,
    lines: ['first frame'],
    numberOfVisibleLines: 32,
    selections: new Uint32Array([0, 0, 0, 0]),
    uid,
    uri: 'untitled:bad-apple',
  }
  EditorStates.set(uid, editor, editor)
  try {
    const result = await commandMap['Editor.setText'](uid, 'second frame')
    expect(EditorStates.get(uid).newState.lines).toEqual(['second frame'])
    expect(EditorStates.get(uid).newState.undoStack).toHaveLength(1)
    expect(result).toBeUndefined()
    expect(await commandMap['Editor.getText'](uid)).toBe('second frame')
    expect(await commandMap['Editor.redo'](uid)).toBeUndefined()
    expect(await commandMap['Editor.undo'](uid)).toBeUndefined()
    expect(await commandMap['Editor.getText'](uid)).toBe('first frame')
  } finally {
    EditorStates.dispose(uid)
  }
})
