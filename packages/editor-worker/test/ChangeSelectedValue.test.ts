import { expect, test } from '@jest/globals'
import { changeValue, findValueAt } from '../src/parts/ChangeSelectedValue/ChangeSelectedValue.ts'

test.each([
  ['0', 1, '1'],
  ['9', 1, '10'],
  ['0', -1, '-1'],
  ['-1', 1, '0'],
  ['+1', 1, '+2'],
  ['009', 1, '010'],
  ['1.5', 1, '1.6'],
  ['1.50', 1, '1.51'],
  ['1.00', -1, '0.99'],
  ['0.0', -1, '-0.1'],
  ['.9', 1, '1.0'],
  ['-.5', 1, '-.4'],
  ['1.', 1, '2.'],
  ['1.2e3', 1, '1.3e3'],
  ['1.20E+03', -1, '1.19E+03'],
  ['999999999999999999999999', 1, '1000000000000000000000000'],
])('changes %s by %i to %s', (value, delta, expected) => {
  expect(changeValue(value, delta)).toBe(expected)
})

test.each([
  ['#123', 1, undefined, '#234'],
  ['#123a', -1, undefined, '#012a'],
  ['#010203', 1, undefined, '#020304'],
  ['#01020380', 1, undefined, '#02030480'],
  ['#10fe20', 1, 3, '#10ff20'],
  ['#10ff20', 1, 3, '#10ff20'],
  ['#ABCDEF', -1, 5, '#ABCDEE'],
  ['#000000fe', 1, 8, '#000000ff'],
])('changes color %s by %i at %s to %s', (value, delta, activeOffset, expected) => {
  expect(changeValue(value, delta, activeOffset)).toBe(expected)
})

test('leaves unsupported text unchanged', () => {
  expect(changeValue('hello', 1)).toBe('hello')
})

test('finds a number under the cursor', () => {
  expect(findValueAt('width: 12.50px', 10)).toEqual({
    end: 12,
    start: 7,
    value: '12.50',
  })
})

test('finds a number when the cursor is at its end', () => {
  expect(findValueAt('count = 42', 10)).toEqual({
    end: 10,
    start: 8,
    value: '42',
  })
})

test('does not find digits embedded in an identifier', () => {
  expect(findValueAt('item2', 4)).toBeUndefined()
})

test('finds a hex color before considering its numeric parts', () => {
  expect(findValueAt('color: #10fe20', 10)).toEqual({
    end: 14,
    start: 7,
    value: '#10fe20',
  })
})

test('does not find an invalid-length hex color', () => {
  expect(findValueAt('color: #12', 8)).toBeUndefined()
})
