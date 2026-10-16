import { expect, test } from '@jest/globals'
import { shouldOpenAutomaticCompletion } from '../src/parts/ShouldOpenAutomaticCompletion/ShouldOpenAutomaticCompletion.ts'

const editor = (text: string) => ({
  completionsOnType: false,
  isQuickSuggestionsEnabled: true,
  languageId: 'typescript',
  largeFile: false,
  lines: text.split('\n'),
  selections: new Uint32Array([text.split('\n').length - 1, text.split('\n').at(-1)!.length]),
})

test.each(['const value = obj.', 'value', 'const value = `text ${obj.', '/* comment\n*/ value'])(
  'TypeScript suggestions default on for code: %s',
  (text) => {
    expect(shouldOpenAutomaticCompletion(editor(text))).toBe(true)
  },
)

test.each(['"text', "'text", '// text', '/* multi\nline', '`text', 'value ', ''])(
  'TypeScript suggestions stay hidden for content or nontrigger characters: %s',
  (text) => {
    expect(shouldOpenAutomaticCompletion(editor(text))).toBe(false)
  },
)

test('settings and large-file guards preserve opt-out and other-language behavior', () => {
  const state = editor('value')
  expect(shouldOpenAutomaticCompletion({ ...state, isQuickSuggestionsEnabled: false })).toBe(false)
  expect(shouldOpenAutomaticCompletion({ ...state, largeFile: true })).toBe(false)
  expect(shouldOpenAutomaticCompletion({ ...state, languageId: 'javascript' })).toBe(false)
  expect(shouldOpenAutomaticCompletion({ ...state, completionsOnType: true, languageId: 'javascript' })).toBe(true)
})
