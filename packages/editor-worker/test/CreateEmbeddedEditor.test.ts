import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { RendererWorker, SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'
import { createEmbeddedEditor, type StandaloneEditorOptions } from '../src/diffSdk.ts'

const rpc = MockRpc.create({ commandMap: {}, invoke: async () => [] })
RendererWorker.set(rpc)
SyntaxHighlightingWorker.set(rpc)

const options: StandaloneEditorOptions = {
  assetDir: '',
  charWidth: 9,
  content: 'hello\nworld',
  fontFamily: 'monospace',
  fontSize: 15,
  fontWeight: 400,
  height: 200,
  id: 1901,
  languageId: 'plaintext',
  letterSpacing: 0,
  lineNumbers: false,
  platform: 2,
  rowHeight: 20,
  tabSize: 2,
  tokenizePath: '',
  uri: 'file:///embedded.txt',
  width: 600,
  x: 0,
  y: 0,
}

test('embedded editors reuse line copying, selections, typing and undo', async () => {
  const editor = await createEmbeddedEditor(options)
  try {
    await editor.execute('Editor.copyLineDown')
    expect(editor.getState().lines).toEqual(['hello', 'hello', 'world'])
    await editor.execute('EditorText.selectWord', 1, 0)
    expect(editor.getState().selections).toEqual(new Uint32Array([1, 0, 1, 5]))
    await editor.execute('type', 'replacement')
    expect(editor.getState().lines).toEqual(['hello', 'replacement', 'world'])
    await editor.execute('undo')
    expect(editor.getState().lines).toEqual(['hello', 'hello', 'world'])
  } finally {
    await editor.dispose()
  }
})

test('concurrent commands are applied in order without losing edits', async () => {
  const editor = await createEmbeddedEditor(options)
  try {
    await Promise.all([editor.execute('type', 'a'), editor.execute('type', 'b')])
    expect(editor.getState().lines).toEqual(['abhello', 'world'])
  } finally {
    await editor.dispose()
  }
})

test('disposal drains accepted commands and rejects later commands', async () => {
  const editor = await createEmbeddedEditor(options)
  const command = editor.execute('copyLineDown')
  const disposed = editor.dispose()
  expect(editor.dispose()).toBe(disposed)
  await expect(editor.execute('copyLineUp')).rejects.toThrow('disposed')
  expect(() => editor.getState()).toThrow('disposed')
  await command
  await disposed
  const replacement = await createEmbeddedEditor(options)
  expect(replacement.getState().lines).toEqual(['hello', 'world'])
  await replacement.dispose()
})

test('duplicate creation cannot replace an existing or initializing editor', async () => {
  const pending = createEmbeddedEditor(options)
  await expect(createEmbeddedEditor(options)).rejects.toThrow('already exists')
  const editor = await pending
  try {
    await expect(createEmbeddedEditor(options)).rejects.toThrow('already exists')
    expect(editor.getState().lines).toEqual(['hello', 'world'])
  } finally {
    await editor.dispose()
  }
})

test('rejects global and unknown commands without poisoning the queue', async () => {
  const editor = await createEmbeddedEditor(options)
  try {
    await expect(editor.execute('terminate')).rejects.toThrow('Unsupported')
    await expect(editor.execute('dispose')).rejects.toThrow('Unsupported')
    await expect(editor.execute('nonexistent')).rejects.toThrow('Unsupported')
    await editor.execute('copyLineUp')
    expect(editor.getState().lines).toEqual(['hello', 'hello', 'world'])
  } finally {
    await editor.dispose()
  }
})

test('a failed command does not prevent subsequent edits', async () => {
  const editor = await createEmbeddedEditor(options)
  try {
    await expect(editor.execute('selectWord', 99, 0)).rejects.toThrow()
    await editor.execute('copyLineDown')
    expect(editor.getState().lines).toEqual(['hello', 'hello', 'world'])
  } finally {
    await editor.dispose()
  }
})

test('two embedded editors of the same document synchronize their text', async () => {
  const first = await createEmbeddedEditor(options)
  const second = await createEmbeddedEditor({ ...options, id: 1902 })
  try {
    await Promise.all([first.execute('copyLineDown'), second.execute('copyLineDown')])
    expect(first.getState().lines).toEqual(['hello', 'hello', 'hello', 'world'])
    expect(second.getState().lines).toEqual(first.getState().lines)
  } finally {
    await Promise.all([first.dispose(), second.dispose()])
  }
})

test('editors from different applications do not synchronize text', async () => {
  const first = await createEmbeddedEditor({ ...options, applicationId: 'first' })
  const second = await createEmbeddedEditor({ ...options, applicationId: 'second', id: 1902 })
  try {
    await first.execute('copyLineDown')
    expect(second.getState().lines).toEqual(['hello', 'world'])
  } finally {
    await Promise.all([first.dispose(), second.dispose()])
  }
})
