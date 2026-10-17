import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { setEndOfLine } from '../src/parts/EditorCommand/EditorCommandSetEndOfLine.ts'

test('setEndOfLine marks the editor modified and preserves text lines', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Main.handleModifiedStatusChange': () => {},
  })
  const editor = {
    endOfLine: 'lf',
    focused: false,
    lines: ['one', 'two'],
    modified: false,
    uri: '/test/file.txt',
  }

  const result = await setEndOfLine(editor, 'crlf')

  expect(result).toEqual({
    ...editor,
    endOfLine: 'crlf',
    focused: true,
    lines: ['one', 'two'],
    modified: true,
  })
  expect(result.lines).not.toBe(editor.lines)
  expect(mockRendererRpc.invocations).toEqual([['Main.handleModifiedStatusChange', '/test/file.txt', true]])
})

test('setEndOfLine preserves the editor when unchanged', async () => {
  const editor = { endOfLine: 'lf' }
  await expect(setEndOfLine(editor, 'lf')).resolves.toBe(editor)
})

test('setEndOfLine rejects unsupported values', async () => {
  await expect(setEndOfLine({ endOfLine: 'lf' }, 'invalid' as any)).rejects.toThrow('Unsupported end of line sequence: invalid')
})
