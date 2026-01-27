import { expect, test } from '@jest/globals'
import { getRegexMatches } from '../src/parts/LinkDetection/getRegexMatches.ts'

test('returns empty array for no matches', () => {
  const regex = /foo/g
  const result = getRegexMatches('bar baz qux', regex)
  expect(result).toEqual([])
})

test('returns single match', () => {
  const regex = /hello/g
  const result = getRegexMatches('hello world', regex)
  expect(result).toHaveLength(1)
  expect(result[0]?.[0]).toBe('hello')
})

test('returns multiple matches', () => {
  const regex = /test/g
  const result = getRegexMatches('test one test two test three', regex)
  expect(result).toHaveLength(3)
  expect(result[0]?.[0]).toBe('test')
  expect(result[1]?.[0]).toBe('test')
  expect(result[2]?.[0]).toBe('test')
})

test('returns matches with capture groups', () => {
  const regex = /(\w+)=(\d+)/g
  const result = getRegexMatches('a=1 b=2 c=3', regex)
  expect(result).toHaveLength(3)
  expect(result[0]?.[0]).toBe('a=1')
  expect(result[0]?.[1]).toBe('a')
  expect(result[0]?.[2]).toBe('1')
})

test('returns matches with match indices', () => {
  const regex = /\d+/g
  const result = getRegexMatches('a1b2c3', regex)
  expect(result).toHaveLength(3)
  expect(result[0]?.index).toBe(1)
  expect(result[1]?.index).toBe(3)
  expect(result[2]?.index).toBe(5)
})

test('handles empty string', () => {
  const regex = /test/g
  const result = getRegexMatches('', regex)
  expect(result).toEqual([])
})

test('handles case-insensitive regex', () => {
  const regex = /hello/gi
  const result = getRegexMatches('Hello HELLO hello', regex)
  expect(result).toHaveLength(3)
  expect(result[0]?.[0]).toBe('Hello')
  expect(result[1]?.[0]).toBe('HELLO')
  expect(result[2]?.[0]).toBe('hello')
})

test('handles regex with special characters', () => {
  const regex = /\b\w+@\w+\.\w+\b/g
  const result = getRegexMatches('Contact user@example.com or admin@test.org', regex)
  expect(result).toHaveLength(2)
  expect(result[0]?.[0]).toBe('user@example.com')
  expect(result[1]?.[0]).toBe('admin@test.org')
})

test('handles URLs detection with regex', () => {
  const regex = /https?:\/\/\S+/g
  const result = getRegexMatches('Visit http://example.com and https://test.org', regex)
  expect(result).toHaveLength(2)
  expect(result[0]?.[0]).toContain('example.com')
  expect(result[1]?.[0]).toContain('test.org')
})

test('handles multiline text', () => {
  const regex = /line/g
  const result = getRegexMatches('line one\nline two\nline three', regex)
  expect(result).toHaveLength(3)
})

test('handles overlapping patterns correctly with global flag', () => {
  const regex = /a+/g
  const result = getRegexMatches('aaa bbb aaa', regex)
  expect(result).toHaveLength(2)
  expect(result[0]?.[0]).toBe('aaa')
  expect(result[1]?.[0]).toBe('aaa')
})

test('handles word boundaries', () => {
  const regex = /\btest\b/g
  const result = getRegexMatches('test testing tested test', regex)
  expect(result).toHaveLength(2)
  expect(result[0]?.index).toBe(0)
  expect(result[1]?.index).toBe(21)
})

test('returns correct input property on matches', () => {
  const text = 'hello world'
  const regex = /\w+/g
  const result = getRegexMatches(text, regex)
  expect(result[0]?.input).toBe(text)
  expect(result[1]?.input).toBe(text)
})

test('handles character class patterns', () => {
  const regex = /[aeiou]/g
  const result = getRegexMatches('hello world', regex)
  expect(result).toHaveLength(3)
  expect(result[0]?.[0]).toBe('e')
  expect(result[1]?.[0]).toBe('o')
  expect(result[2]?.[0]).toBe('o')
})

test('handles alternation patterns', () => {
  const regex = /cat|dog|bird/g
  const result = getRegexMatches('I have a cat and a dog and a bird', regex)
  expect(result).toHaveLength(3)
  expect(result[0]?.[0]).toBe('cat')
  expect(result[1]?.[0]).toBe('dog')
  expect(result[2]?.[0]).toBe('bird')
})

test('handles quantifiers', () => {
  const regex = /a{2,3}/g
  const result = getRegexMatches('aa aaa aaaa', regex)
  expect(result).toHaveLength(3)
  expect(result[0]?.[0]).toBe('aa')
  expect(result[1]?.[0]).toBe('aaa')
  expect(result[2]?.[0]).toBe('aaa')
})
