import { expect, test } from '@jest/globals'
import { isTypeScriptCode } from '../src/parts/IsTypeScriptCode/IsTypeScriptCode.ts'

test.each([
  'const value = "text',
  "const value = 'text",
  'const value = "escaped \\" text',
  'const value = `text',
  'const value = `text\nsecond line',
  'const value = `escaped \\${value',
  '// comment',
  'const value = 1 // comment',
  '/* comment\nsecond line',
  'const value = `text ${ /* comment',
  'const value = `text ${ "quoted',
  'const value = `text ${ value } text',
  'const value = /["`/]',
])('suppresses suggestions in lexical content: %s', (text) => {
  expect(isTypeScriptCode(text)).toBe(false)
})

test.each([
  '',
  'const value = object.',
  'const value = "text"; object.',
  "const value = 'text'; object.",
  '// comment\nobject.',
  '/* comment\nsecond line */ object.',
  'const value = `text ${ object.',
  'const value = `text ${ { nested: object.',
  'const value = `text ${ { nested: value }.',
  'const value = `text ${ `nested ${ object.',
  'const value = `text ${ `nested` + object.',
  'const value = `text`; object.',
  'const value = /["`/]/; object.',
  'const value = 1 / 2; object.',
])('allows suggestions in executable code: %s', (text) => {
  expect(isTypeScriptCode(text)).toBe(true)
})
