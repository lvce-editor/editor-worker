import { expect, test } from '@jest/globals'
import * as TokenizerMap from '../src/parts/TokenizerMap/TokenizerMap.ts'

test('different editor tokenizers cannot replace each other', () => {
  const first = { language: 'first' }
  const second = { language: 'second' }
  const firstId = TokenizerMap.register(first)
  const secondId = TokenizerMap.register(second)
  expect(firstId).not.toBe(secondId)
  expect(TokenizerMap.get(firstId)).toBe(first)
  expect(TokenizerMap.get(secondId)).toBe(second)
})

test('reopening editors reuses tokenizer registrations', () => {
  const tokenizer = { language: 'shared' }
  const firstId = TokenizerMap.register(tokenizer)
  expect(TokenizerMap.register(tokenizer)).toBe(firstId)
})
