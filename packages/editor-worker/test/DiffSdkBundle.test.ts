import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { RendererWorker, SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'
import { readFile } from 'node:fs/promises'

test('published SDK imports and edits without installing worker listeners', async () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'addEventListener')
  Object.defineProperty(globalThis, 'addEventListener', {
    configurable: true,
    value: () => {
      throw new Error('The SDK must not start a worker')
    },
  })
  try {
    const { createEmbeddedEditor } = await import('../../../.tmp/dist/dist/diff-sdk.js')
    const rpc = MockRpc.create({ commandMap: {}, invoke: async () => [] })
    RendererWorker.set(rpc)
    SyntaxHighlightingWorker.set(rpc)
    const editor = await createEmbeddedEditor({
      assetDir: '',
      charWidth: 9,
      content: 'hello',
      fontFamily: 'monospace',
      fontSize: 15,
      fontWeight: 400,
      height: 100,
      id: 991,
      languageId: 'plaintext',
      letterSpacing: 0,
      lineNumbers: false,
      platform: 2,
      rowHeight: 20,
      tabSize: 2,
      tokenizePath: '',
      uri: 'file:///sdk.txt',
      width: 600,
      x: 0,
      y: 0,
    })
    try {
      await expect(editor.execute('dispose')).rejects.toThrow('Unsupported editor command')
      await expect(editor.execute('getState')).rejects.toThrow('Unsupported editor command')
      await editor.execute('type', 'x')
      expect(editor.getState().lines).toEqual(['xhello'])
    } finally {
      await editor.dispose()
    }
  } finally {
    if (previous) {
      Object.defineProperty(globalThis, 'addEventListener', previous)
    } else {
      delete (globalThis as { addEventListener?: unknown }).addEventListener
    }
  }
})

test('normal worker bundle does not load the diff SDK', async () => {
  const code = await readFile(new URL('../../../.tmp/dist/dist/editorWorkerMain.js', import.meta.url), 'utf8')
  expect(code).not.toContain('createEmbeddedEditor')
  expect(code).not.toContain('diff-sdk')
  expect(code).not.toContain('stateCommands')
  expect(code).not.toContain('isStateCommand')
})
