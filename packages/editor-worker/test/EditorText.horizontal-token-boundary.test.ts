import { expect, test } from '@jest/globals'
import * as EditorText from '../src/parts/EditorText/EditorText.ts'
import * as TokenizerMap from '../src/parts/TokenizerMap/TokenizerMap.ts'
import * as TokenizerState from '../src/parts/TokenizerState/TokenizerState.ts'
import * as TokenMaps from '../src/parts/TokenMaps/TokenMaps.ts'

test.each(['default', 'embedded'])('renders the next token when a clipped %s line begins at a token boundary', async (mode) => {
  const languageId = `horizontal-boundary-${mode}`
  const line = 'a'.repeat(100) + 'b'.repeat(900)
  const tokens = [1, 100, 2, 900]
  const tokenMap = { 1: 'First', 2: 'Second' }
  TokenizerMap.set(languageId, {
    hasArrayReturn: true,
    initialLineState: { state: 1 },
    tokenizeLine() {
      return {
        ...(mode === 'embedded' && {
          embeddedLanguage: 'horizontal-boundary-inner',
          embeddedLanguageEnd: line.length,
          embeddedLanguageStart: 0,
        }),
        state: 1,
        tokens,
      }
    },
  })
  TokenMaps.set(languageId, tokenMap)
  TokenizerState.set('horizontal-boundary-inner', {
    hasArrayReturn: true,
    initialLineState: { state: 1 },
    tokenizeLine: () => ({ state: 1, tokens }),
    TokenMap: tokenMap,
  })
  const editor = {
    charWidth: 1,
    decorations: [],
    deltaX: 100,
    id: 1,
    invalidStartIndex: 0,
    isMonospaceFont: true,
    languageId,
    lineCache: [],
    lines: [line],
    minLineY: 0,
    numberOfVisibleLines: 1,
    tokenizerId: languageId,
    width: 10,
  }
  const result = await EditorText.getVisible(editor, false)
  expect(result.horizontalVisibleRanges).toEqual([{ end: 111, rowIndex: 0, start: 100 }])
  expect(result.textInfos).toEqual([['b'.repeat(11), 'Token Second']])
})
