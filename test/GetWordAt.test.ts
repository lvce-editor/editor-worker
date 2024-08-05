import { expect, test } from '@jest/globals'
import * as GetWordAt from '../src/parts/GetWordAt/GetWordAt.ts'

test('getWordAt - with dash', () => {
  const line = 'text-dec'
  const columnIndex = 8
  expect(GetWordAt.getWordAt(line, columnIndex)).toEqual({
    word: 'text-dec',
  })
})

test('getWordAt - before and after match', () => {
  const line = 'text-dec'
  const columnIndex = 4
  expect(GetWordAt.getWordAt(line, columnIndex)).toEqual({
    word: 'text-dec',
  })
})