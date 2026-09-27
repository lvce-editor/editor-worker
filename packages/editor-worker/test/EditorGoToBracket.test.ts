import { expect, test } from '@jest/globals'
import { goToBracket } from '../src/parts/EditorCommand/EditorCommandGoToBracket.ts'

test('goToBracket navigates between a multiline pair', () => {
  const editor = {
    lines: ['{', 'value', '}'],
    selections: new Uint32Array([0, 0, 0, 0]),
  }
  expect(goToBracket(editor)).toMatchObject({
    selections: new Uint32Array([2, 0, 2, 0]),
  })
})

test('goToBracket toggles between bracket starts', () => {
  const editor = {
    lines: ['(value)'],
    selections: new Uint32Array([0, 1, 0, 1]),
  }
  const atClosingBracket = goToBracket(editor)
  expect(atClosingBracket).toMatchObject({
    selections: new Uint32Array([0, 6, 0, 6]),
  })
  expect(goToBracket(atClosingBracket)).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 0]),
  })
})

test('goToBracket supports multiple cursors', () => {
  const editor = {
    lines: ['()', '{}'],
    selections: new Uint32Array([0, 0, 0, 0, 1, 2, 1, 2]),
  }
  expect(goToBracket(editor)).toMatchObject({
    selections: new Uint32Array([0, 1, 0, 1, 1, 0, 1, 0]),
  })
})

test('goToBracket navigates to the closing bracket of the innermost enclosing pair', () => {
  const editor = {
    lines: ['outer(inner[value])'],
    selections: new Uint32Array([0, 13, 0, 13]),
  }
  expect(goToBracket(editor)).toMatchObject({
    selections: new Uint32Array([0, 17, 0, 17]),
  })
})

test('goToBracket navigates to the next bracket when there is no enclosing pair', () => {
  const editor = {
    lines: ['value  (next)'],
    selections: new Uint32Array([0, 2, 0, 2]),
  }
  expect(goToBracket(editor)).toMatchObject({
    selections: new Uint32Array([0, 7, 0, 7]),
  })
})

test('goToBracket leaves a cursor without a pair unchanged', () => {
  const editor = {
    lines: ['value'],
    selections: new Uint32Array([0, 2, 0, 2]),
  }
  expect(goToBracket(editor)).toMatchObject({ selections: editor.selections })
})
