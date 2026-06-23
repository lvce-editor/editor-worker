import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import * as RenderIncremental from '../src/parts/RenderIncremental/RenderIncremental.ts'

const createState = (minLineY: number, textInfos: readonly any[]): any => ({
  differences: textInfos.map(() => 0),
  initial: false,
  minLineY,
  textInfos,
  uid: 1,
})

test('renderIncremental uses full render when visible rows jump during fast scroll', () => {
  const oldState = createState(0, [
    [
      ' '.repeat(4),
      'Token Whitespace',
      '"',
      'Token Punctuation',
      'node_modules/@babel/helper-validator-identifier',
      'Token JsonPropertyName',
      '"',
      'Token Punctuation',
      ':',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      '{',
      'Token Punctuation',
    ],
  ])
  const newState = createState(4, [
    [
      ' '.repeat(4),
      'Token Whitespace',
      '"',
      'Token Punctuation',
      '@cspell/dict-dotnet',
      'Token JsonPropertyName',
      '"',
      'Token Punctuation',
      ':',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      '"',
      'Token Punctuation',
      '^5.0.13',
      'Token JsonPropertyValueString',
      '"',
      'Token Punctuation',
      ',',
      'Token Punctuation',
    ],
  ])

  const command = RenderIncremental.renderIncremental(oldState, newState)

  expect(command[0]).toBe(ViewletCommand.SetPatches)
  expect(command[1]).toBe(1)
  expect(command[2]).toEqual([
    {
      nodes: expect.any(Array),
      type: 6,
    },
  ])
})
