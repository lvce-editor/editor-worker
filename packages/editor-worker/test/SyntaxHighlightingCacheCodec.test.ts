import { expect, test } from '@jest/globals'
import type { CachedViewport } from '../src/parts/SyntaxHighlightingCacheCodec/SyntaxHighlightingCacheCodec.ts'
import { decode, encode } from '../src/parts/SyntaxHighlightingCacheCodec/SyntaxHighlightingCacheCodec.ts'

const now = 1_000_000
const viewport: CachedViewport = {
  embeddedResults: [{ isFull: false, result: { tokens: [60, 70_000] }, TokenMap: { 60: 'Comment' } }],
  tokenizersToLoad: [],
  tokens: [
    { embeddedLanguageEnd: 70_008, embeddedLanguageStart: 8, embeddedResultIndex: 0, tokens: [228, 8, 50, 70_000] },
    { tokens: [] },
    { tokens: [0xff_ff_ff_ff, 2] },
  ],
}

test('round trip preserves line boundaries, long lengths, uint32 token types and embedded rendering', () => {
  expect(decode(encode(viewport, now + 1000)!, [70_008, 0, 2], now)).toEqual(viewport)
})

test('numeric tokens are smaller than JSON arrays for a representative token-heavy viewport', () => {
  const tokens = Array.from({ length: 1000 }, () => [228, 120]).flat()
  const result = { embeddedResults: [], tokenizersToLoad: [], tokens: [{ tokens }] }
  expect(encode(result, now + 1000)!.byteLength).toBeLessThan(new TextEncoder().encode(JSON.stringify(result)).byteLength)
})

test('expired, truncated and wrong-format entries are misses', () => {
  const buffer = encode(viewport, now + 1000)!
  expect(decode(buffer, [70_008, 0, 2], now + 1000)).toBeUndefined()
  expect(decode(buffer.slice(0, buffer.byteLength - 1), [70_008, 0, 2], now)).toBeUndefined()
  expect(decode(new ArrayBuffer(20), [], now)).toBeUndefined()
  expect(decode(buffer, [1, 0, 2], now)).toBeUndefined()
  expect(decode(buffer, [70_008], now)).toBeUndefined()
})

test('unsupported token values cannot be persisted', () => {
  for (const tokens of [[1], [1, -1], [NaN, 1], [2 ** 32, 1], [1, 1.5]]) {
    expect(() => encode({ embeddedResults: [], tokenizersToLoad: [], tokens: [{ tokens }] }, now + 1000)).toThrow()
  }
  expect(encode({ ...viewport, tokenizersToLoad: ['javascript'] }, now + 1000)).toBeUndefined()
})

test('empty embedded opening range from the built-in HTML tokenizer can be reused', () => {
  const result: CachedViewport = {
    embeddedResults: [{ isFull: false, result: { tokens: [] }, TokenMap: {} }],
    tokenizersToLoad: [],
    tokens: [{ embeddedLanguageEnd: 0, embeddedLanguageStart: 8, embeddedResultIndex: 0, tokens: [228, 1, 118, 6, 228, 1] }],
  }
  expect(decode(encode(result, now + 1000)!, [8], now)).toEqual(result)
})

test('reversed embedded ranges with content or outside the line remain invalid', () => {
  for (const [start, embeddedTokens, isFull] of [
    [9, [], false],
    [8, [60, 1], false],
    [8, [], true],
  ] as const) {
    const result: CachedViewport = {
      embeddedResults: [{ isFull, result: { tokens: embeddedTokens }, TokenMap: {} }],
      tokenizersToLoad: [],
      tokens: [{ embeddedLanguageEnd: 0, embeddedLanguageStart: start, embeddedResultIndex: 0, tokens: [228, 8] }],
    }
    expect(decode(encode(result, now + 1000)!, [8], now)).toBeUndefined()
  }
})
