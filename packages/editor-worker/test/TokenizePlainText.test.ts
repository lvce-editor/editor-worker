import { expect, test } from '@jest/globals'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test('tokenizeLine', () => {
  const line = 'abc'
  const lineState = {
    state: 0,
  }
  expect(TokenizePlainText.tokenizeLine(line, lineState)).toEqual({
    state: 0,
    tokens: [1, 3],
  })
})
