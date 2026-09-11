import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker, SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'
import { toggleBlockComment } from '../src/parts/EditorCommand/EditorCommandToggleBlockComment.ts'
import { emptyEditor } from '../src/parts/EmptyEditor/EmptyEditor.ts'

const mockRpc = MockRpc.create({
  commandMap: {},
  invoke: async (method: string) => {
    if (method === 'Languages.getLanguageConfiguration') {
      return { comments: { lineComment: '#' } }
    }
    return undefined
  },
})
ExtensionHost.set(mockRpc)
RendererWorker.set(mockRpc)
SyntaxHighlightingWorker.set(MockRpc.create({ commandMap: {}, invoke: async () => [{}] }))

test('toggles selected YAML lines when the language has no block comment', async () => {
  const editor = {
    ...emptyEditor,
    languageId: 'yaml',
    lines: ['steps:', '  run: test', '  env: production'],
    selections: new Uint32Array([1, 0, 2, 17]),
    uri: 'file:///test.yaml',
  }
  const commented = await toggleBlockComment(editor)
  expect(commented.lines).toEqual(['steps:', '  # run: test', '  # env: production'])
  const uncommented = await toggleBlockComment(commented)
  expect(uncommented.lines).toEqual(editor.lines)
})

test.each([
  { lines: ['name: demo'], selections: [0, 4, 0, 4], expected: ['# name: demo'] },
  { lines: ['one: 1', 'two: 2'], selections: [0, 2, 1, 0], expected: ['# one: 1', 'two: 2'] },
  { lines: ['one: 1', 'two: 2'], selections: [1, 6, 0, 0], expected: ['# one: 1', '# two: 2'] },
  { lines: ['# existing', 'value: 1'], selections: [0, 0, 1, 8], expected: ['# # existing', '# value: 1'] },
  { lines: ['#one: 1', '# two: 2'], selections: [0, 0, 1, 8], expected: ['one: 1', 'two: 2'] },
  { lines: ['one: 1', '  ', 'two: 2'], selections: [0, 0, 2, 6], expected: ['# one: 1', '  ', '# two: 2'] },
  { lines: ['  '], selections: [0, 0, 0, 2], expected: ['  '] },
  { lines: ['one: 1', 'two: 2'], selections: [0, 0, 1, 6, 1, 0, 1, 6], expected: ['# one: 1', '# two: 2'] },
])('line-comment fallback: $selections on $lines', async ({ lines, selections, expected }) => {
  const editor = { ...emptyEditor, lines, selections: new Uint32Array(selections), uri: 'file:///test.yaml' }
  const result = await toggleBlockComment(editor)
  expect(result.lines).toEqual(expected)
})
