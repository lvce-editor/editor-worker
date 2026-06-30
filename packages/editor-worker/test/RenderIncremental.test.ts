import { beforeEach, expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import * as RenderedDoms from '../src/parts/RenderedDoms/RenderedDoms.ts'
import * as RenderIncremental from '../src/parts/RenderIncremental/RenderIncremental.ts'

const createState = (minLineY: number, textInfos: readonly any[]): any => ({
  differences: textInfos.map(() => 0),
  initial: false,
  minLineY,
  textInfos,
  uid: 1,
})

beforeEach(() => {
  RenderedDoms.clear()
})

test('renderIncremental preserves surrounding dom when visible rows jump during fast scroll', () => {
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
  expect(command[2]).not.toEqual([
    {
      nodes: expect.any(Array),
      type: 6,
    },
  ])
  expect(command[2]).not.toContainEqual(
    expect.objectContaining({
      type: 2,
    }),
  )
  expect(command[2]).not.toContainEqual(
    expect.objectContaining({
      index: 3,
      type: 9,
    }),
  )
})

test('renderIncremental diffs from the last emitted dom when editor state is mutated', () => {
  const textInfos = [
    [
      ' '.repeat(6),
      'Token Whitespace',
      '"',
      'Token Punctuation',
      'lerna',
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
  ]
  const initialState = createState(0, [])
  initialState.initial = true
  const renderedState = createState(0, textInfos)

  RenderIncremental.renderIncremental(initialState, renderedState)
  textInfos[0] = [
    ' '.repeat(6),
    'Token Whitespace',
    '"',
    'Token Punctuation',
    'lerna',
    'Token JsonPropertyName',
    '"',
    'Token Punctuation',
    ':',
    'Token Punctuation',
    ' ',
    'Token Whitespace',
    '"',
    'Token Punctuation',
    '^8.2.4',
    'Token JsonPropertyValueString',
    '"',
    'Token Punctuation',
    ',',
    'Token Punctuation',
  ]
  const newState = createState(0, textInfos)

  const command = RenderIncremental.renderIncremental(renderedState, newState)

  expect(command[0]).toBe(ViewletCommand.SetPatches)
  expect(command[1]).toBe(1)
  expect(command[2]).not.toEqual([])
})
