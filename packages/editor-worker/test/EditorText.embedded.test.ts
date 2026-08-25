import { expect, test } from '@jest/globals'
import * as EditorText from '../src/parts/EditorText/EditorText.ts'
import * as TokenizerMap from '../src/parts/TokenizerMap/TokenizerMap.ts'
import * as TokenizerState from '../src/parts/TokenizerState/TokenizerState.ts'
import * as TokenMaps from '../src/parts/TokenMaps/TokenMaps.ts'

test('getVisible - renders partial embedded tokens with surrounding tokens', async () => {
  const line = '<style>h1 {color:red}</style>'
  const tokenizerId = 'html-with-inline-css'
  const languageId = 'html-with-inline-css'
  TokenizerMap.set(tokenizerId, {
    hasArrayReturn: true,
    initialLineState: { state: 1 },
    tokenizeLine() {
      return {
        embeddedLanguage: 'css-inline-test',
        embeddedLanguageEnd: 21,
        embeddedLanguageStart: 7,
        state: 1,
        tokens: [1, 7, 2, 14, 1, 8],
      }
    },
  })
  TokenMaps.set(languageId, {
    1: 'Html',
    2: 'Embedded',
  })
  TokenizerState.set('css-inline-test', {
    hasArrayReturn: true,
    initialLineState: { state: 1 },
    tokenizeLine() {
      return {
        state: 1,
        tokens: [1, 4, 2, 5, 3, 5],
      }
    },
    TokenMap: {
      1: 'CssSelector',
      2: 'CssPropertyName',
      3: 'CssPropertyValue',
    },
  })
  const editor = {
    charWidth: 9,
    decorations: [],
    deltaX: 0,
    id: 1,
    invalidStartIndex: 0,
    languageId,
    lineCache: [],
    lines: [line],
    minLineY: 0,
    numberOfVisibleLines: 1,
    tokenizerId,
    width: 800,
  }

  const { textInfos } = await EditorText.getVisible(editor, false)

  expect(textInfos).toEqual([
    [
      '<style>',
      'Token Html',
      'h1 {',
      'Token CssSelector',
      'color',
      'Token CssPropertyName',
      ':red}',
      'Token CssPropertyValue',
      '</style>',
      'Token Html',
    ],
  ])
})
