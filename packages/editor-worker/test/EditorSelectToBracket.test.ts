import { expect, test } from '@jest/globals'
import { selectToBracket } from '../src/parts/EditorCommand/EditorCommandSelectToBracket.ts'

test('selectToBracket selects the brackets and their contents', () => {
  const editor = {
    lines: ['before {value} after'],
    selections: new Uint32Array([0, 7, 0, 7]),
  }
  expect(selectToBracket(editor)).toMatchObject({
    selections: new Uint32Array([0, 7, 0, 14]),
  })
})

test('selectToBracket selects a multiline pair', () => {
  const editor = {
    lines: ['[', 'value', ']'],
    selections: new Uint32Array([2, 0, 2, 0]),
  }
  expect(selectToBracket(editor)).toMatchObject({
    selections: new Uint32Array([2, 1, 0, 0]),
  })
})

test('selectToBracket selects the innermost enclosing pair', () => {
  const editor = {
    lines: ['outer(inner[value])'],
    selections: new Uint32Array([0, 13, 0, 13]),
  }
  expect(selectToBracket(editor)).toMatchObject({
    selections: new Uint32Array([0, 11, 0, 18]),
  })
})

test('selectToBracket selects the next pair when there is no enclosing pair', () => {
  const editor = {
    lines: ['value  (next)'],
    selections: new Uint32Array([0, 2, 0, 2]),
  }
  expect(selectToBracket(editor)).toMatchObject({
    selections: new Uint32Array([0, 7, 0, 13]),
  })
})
