import { expect, test } from '@jest/globals'
import * as EscapeRegex from '../src/parts/EscapeRegex/EscapeRegex.ts'

test('empty', () => {
  const regex = ''
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe('')
})

test('character', () => {
  const regex = 'a'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe('a')
})

test('slash', () => {
  const regex = '/'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe('/')
})

test('backslash', () => {
  const regex = '\\'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe('\\\\')
})

test('open curly brace', () => {
  const regex = '{'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe(String.raw`\{`)
})

test('close curly brace', () => {
  const regex = '}'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe(String.raw`\}`)
})

test('star', () => {
  const regex = '*'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe(String.raw`\*`)
})

test('plus', () => {
  const regex = '+'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe(String.raw`\+`)
})

test('question mark', () => {
  const regex = '?'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe(String.raw`\?`)
})

test('pipe', () => {
  const regex = '|'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe(String.raw`\|`)
})

test('caret', () => {
  const regex = '^'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe(String.raw`\^`)
})

test('dollar', () => {
  const regex = '$'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe(String.raw`\$`)
})

test('dot', () => {
  const regex = '.'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe(String.raw`\.`)
})

test('square open', () => {
  const regex = '['
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe(String.raw`\[`)
})

test('square close', () => {
  const regex = ']'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe(String.raw`\]`)
})

test('round open', () => {
  const regex = '('
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe(String.raw`\(`)
})

test('round close', () => {
  const regex = ')'
  expect(EscapeRegex.escapeRegExpCharacters(regex)).toBe(String.raw`\)`)
})
