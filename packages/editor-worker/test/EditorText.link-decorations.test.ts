import { expect, test } from '@jest/globals'
import * as DecorationType from '../src/parts/DecorationType/DecorationType.ts'
import * as EditorText from '../src/parts/EditorText/EditorText.ts'

test('getVisible - link decorations split tokens correctly', async () => {
  const editor = {
    averageCharWidth: 9,
    charWidth: 9,
    columnWidth: 9,
    cursorWidth: 2,
    decorations: [
      2, // offset for 'https://example.com' starting at position 2
      19, // length
      DecorationType.Link,
      0, // modifiers
    ],
    deltaX: 0,
    deltaY: 0,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    height: 600,
    id: 1,
    invalidStartIndex: 0,
    isMonospaceFont: true,
    languageId: 'plaintext',
    letterSpacing: 0,
    lineCache: [
      {
        state: { state: 1 },
        tokens: [1, 28], // One token for the entire line (plaintext)
      },
    ],
    lines: ['  https://example.com more'],
    minLineY: 0,
    numberOfVisibleLines: 30,
    rowHeight: 20,
    selections: [],
    tabSize: 2,
    tokenizerId: 'builtin.plaintext',
    width: 800,
    x: 0,
    y: 0,
  }

  const { textInfos } = await EditorText.getVisible(editor, false)

  expect(textInfos).toHaveLength(1)
  const lineInfo = textInfos[0]

  // The line should be split into: "  " (before link), "https://example.com" (link), " more" (after link)
  // Each part is represented as [text, className] pair
  expect(lineInfo.length).toBeGreaterThanOrEqual(4) // At least 2 tokens (text + className pairs)

  // Find the token with Link class
  const linkTokens = []
  for (let i = 1; i < lineInfo.length; i += 2) {
    const className = lineInfo[i]
    if (className.includes('Link')) {
      const text = lineInfo[i - 1]
      linkTokens.push({ className, text })
    }
  }

  expect(linkTokens.length).toBeGreaterThan(0)
  expect(linkTokens[0].text).toBe('https://example.com')
})

test("getVisible - decorations that don't align with token boundaries", async () => {
  const editor = {
    averageCharWidth: 9,
    charWidth: 9,
    columnWidth: 9,
    cursorWidth: 2,
    decorations: [
      5, // offset: starts at position 5 within the line
      10, // length: 10 characters
      DecorationType.Link,
      0,
    ],
    deltaX: 0,
    deltaY: 0,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    height: 600,
    id: 1,
    invalidStartIndex: 0,
    isMonospaceFont: true,
    languageId: 'plaintext',
    letterSpacing: 0,
    lineCache: [
      {
        state: { state: 1 },
        tokens: [1, 20], // One large token
      },
    ],
    lines: ['some https://ex more'],
    minLineY: 0,
    numberOfVisibleLines: 30,
    rowHeight: 20,
    selections: [],
    tabSize: 2,
    tokenizerId: 'builtin.plaintext',
    width: 800,
    x: 0,
    y: 0,
  }

  const { textInfos } = await EditorText.getVisible(editor, false)

  expect(textInfos).toHaveLength(1)
  const lineInfo = textInfos[0]

  // The token should be split into 3 parts: before link, link part, after link
  expect(lineInfo.length).toBeGreaterThanOrEqual(6) // At least 3 token pairs

  const linkTokens = []
  for (let i = 1; i < lineInfo.length; i += 2) {
    const className = lineInfo[i]
    if (className.includes('Link')) {
      const text = lineInfo[i - 1]
      linkTokens.push({ className, text })
    }
  }

  expect(linkTokens.length).toBeGreaterThan(0)
  expect(linkTokens[0].text).toBe('https://ex')
})
