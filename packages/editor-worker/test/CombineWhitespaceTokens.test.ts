import { expect, test } from '@jest/globals'
import { combineWhitespaceTokens } from '../src/parts/CombineWhitespaceTokens/CombineWhitespaceTokens.ts'

test('combines consecutive spaces and tabs while preserving text and preceding token class', () => {
  const tokens = Object.freeze(['const', 'Token Keyword', ' ', 'Token Whitespace', '\t', 'Token Whitespace', 'x', 'Token Variable'])
  expect(combineWhitespaceTokens(tokens)).toEqual(['const \t', 'Token Keyword', 'x', 'Token Variable'])
})

test('preserves leading whitespace and whitespace-only lines', () => {
  expect(combineWhitespaceTokens(['  ', 'Token Whitespace', 'x', 'Token Variable', ' ', 'Token Whitespace'])).toEqual([
    '  ',
    'Token Whitespace',
    'x ',
    'Token Variable',
  ])
  expect(combineWhitespaceTokens(['\t ', 'Token Whitespace'])).toEqual(['\t ', 'Token Whitespace'])
  expect(combineWhitespaceTokens([])).toEqual([])
})

test('does not combine tokens containing visible characters or line breaks', () => {
  const tokens = ['x', 'Token Variable', ' y', 'Token String', '\n', 'Token Whitespace']
  expect(combineWhitespaceTokens(tokens)).toEqual(tokens)
})

test('preserves decoration boundaries on both sides of whitespace', () => {
  const tokens = ['alpha', 'Token Variable R', ' ', 'Token Whitespace', '=', 'Token Operator', ' ', 'Token Whitespace R']
  expect(combineWhitespaceTokens(tokens)).toEqual(tokens)
})
