import { expect, jest, test } from '@jest/globals'
import * as TokenizerMap from '../src/parts/TokenizerMap/TokenizerMap.ts'

const loadTokenizers = jest.fn<(...args: any[]) => Promise<void>>()

jest.unstable_mockModule('../src/parts/LoadTokenizers/LoadTokenizers.ts', () => ({ loadTokenizers }))

const EditorText = await import('../src/parts/EditorText/EditorText.ts')

const createEditor = () => ({
  charWidth: 9,
  decorations: [],
  deltaX: 0,
  id: 1,
  invalidStartIndex: 0,
  languageId: 'disposal-test',
  lifecycle: { disposed: false },
  lineCache: [],
  lines: ['code'],
  minLineY: 0,
  numberOfVisibleLines: 1,
  tokenizerId: 'disposal-test',
  width: 800,
})

test('does not render a disposed editor viewport', async () => {
  const editor = createEditor()
  editor.lifecycle.disposed = true
  await expect(EditorText.getVisible(editor, false)).resolves.toEqual({ differences: [], textInfos: [] })
})

test('disposal while loading an embedded tokenizer cancels viewport rendering', async () => {
  TokenizerMap.set('disposal-test', {
    hasArrayReturn: true,
    initialLineState: { state: 1 },
    tokenizeLine: () => ({ embeddedLanguage: 'pending-language', embeddedLanguageEnd: 4, embeddedLanguageStart: 0, state: 1, tokens: [0, 4] }),
  })
  const started = Promise.withResolvers<void>()
  const pending = Promise.withResolvers<void>()
  loadTokenizers.mockImplementation(async () => {
    started.resolve()
    await pending.promise
  })
  const editor = createEditor()
  const rendering = EditorText.getVisible(editor, false)
  await started.promise
  editor.lifecycle.disposed = true
  pending.resolve()
  await expect(rendering).resolves.toEqual({ differences: [], textInfos: [] })
  expect(loadTokenizers).toHaveBeenCalledTimes(1)
})
