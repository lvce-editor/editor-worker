import { expect, test } from '@jest/globals'
import * as GetLanguageId from '../src/parts/GetLanguageId/GetLanguageId.ts'

test('getLanguageId - file name in uri', () => {
  const languages = [
    {
      id: 'dotenv',
      extensions: ['.env'],
      fileNames: ['.env.sample'],
    },
  ]

  expect(GetLanguageId.getLanguageId('file:///workspace/.env.sample', languages)).toBe('dotenv')
})

test('getLanguageId - Windows file name', () => {
  const languages = [
    {
      id: 'dotenv',
      extensions: ['.env'],
      fileNames: ['.env.sample'],
    },
  ]

  expect(GetLanguageId.getLanguageId('C:\\workspace\\.env.sample', languages)).toBe('dotenv')
})
