import { expect, test } from '@jest/globals'
import * as EvaluateText from '../src/parts/EvaluateText/EvaluateText.ts'

test('evaluateText - evaluates marked expressions in sequential file context', async () => {
  const result = await EvaluateText.evaluateText('const value = 1\nvalue + 1//?')

  expect(result).toEqual([
    {
      rowIndex: 1,
      value: '2',
    },
  ])
})

test('evaluateText - clears previews when source is invalid', async () => {
  const result = await EvaluateText.evaluateText('const value =')

  expect(result).toEqual([])
})
