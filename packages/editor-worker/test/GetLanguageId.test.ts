import { expect, test } from '@jest/globals'
import * as GetLanguageId from '../src/parts/GetLanguageId/GetLanguageId.ts'

test('getLanguageId - file name in uri', () => {
  const languages = [
    {
      extensions: ['.env'],
      fileNames: ['.env.sample'],
      id: 'dotenv',
    },
  ]

  expect(GetLanguageId.getLanguageId('file:///workspace/.env.sample', languages)).toBe('dotenv')
})

test('getLanguageId - Windows file name', () => {
  const languages = [
    {
      extensions: ['.env'],
      fileNames: ['.env.sample'],
      id: 'dotenv',
    },
  ]

  expect(GetLanguageId.getLanguageId('C:\\workspace\\.env.sample', languages)).toBe('dotenv')
})

test.each(['remote-ssh://host/workspace/Dockerfile', 'file:///workspace/Dockerfile', 'C:\\workspace\\dockerfile'])(
  'getLanguageId - matches a mixed-case filename contribution for %s',
  (uri) => {
    const languages = [{ fileNames: ['Dockerfile'], id: 'dockerfile' }]

    expect(GetLanguageId.getLanguageId(uri, languages)).toBe('dockerfile')
  },
)
