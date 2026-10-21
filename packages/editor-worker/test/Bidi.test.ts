import { expect, test } from '@jest/globals'
import * as Bidi from '../src/parts/Bidi/Bidi.ts'
import { moveBidiCharacter } from '../src/parts/MoveBidiCharacter/MoveBidiCharacter.ts'

const measure = async (text: string): Promise<number> => text.replaceAll('\t', '  ').length * 10

test('ASCII and disabled text bypass bidi', () => {
  expect(Bidi.isBidi('const hello = 123', true)).toBe(false)
  expect(Bidi.isBidi('אבג')).toBe(false)
  expect(Bidi.isBidi('אבג', true)).toBe(true)
  expect(moveBidiCharacter({ lines: ['abc'], rtl: true, selections: new Uint32Array([0, 1, 0, 1]) }, -1)).toBeUndefined()
})

test('canonical visual columns traverse both mixed boundaries in each direction', async () => {
  const line = 'abcאבגdef'
  const columns = [0, 1, 2, 6, 5, 4, 3, 7, 8, 9]
  expect(Bidi.getVisualColumns(line)).toEqual(columns)
  for (let index = 0; index < columns.length; index++) {
    const column = columns[index]
    expect(await Bidi.getPosition(line, column, measure)).toBe(index * 10)
    expect(await Bidi.getColumn(line, index * 10, measure)).toBe(column)
    for (const direction of [-1, 1] as const) {
      const editor = { lines: [line], rtl: true, selections: new Uint32Array([0, column, 0, column]) }
      const result = moveBidiCharacter(editor, direction)
      const expected = columns[Math.max(0, Math.min(columns.length - 1, index + direction))]
      expect(result.selections).toEqual(new Uint32Array([0, expected, 0, expected]))
    }
  }
})

test('RTL graphemes, Arabic numbers, punctuation, and tabs retain logical offsets', async () => {
  expect(Bidi.getVisualColumns('אבג')).toEqual([3, 2, 1, 0])
  expect(Bidi.getVisualColumns('א\u{5B0}ב')).toEqual([3, 2, 0])
  for (const line of ['שלום 123 עולם', 'مرحبا 123 عالم', "'א' => value,", '\tabג', 'a😀אבz']) {
    const columns = Bidi.getVisualColumns(line)
    expect(new Set(columns).size).toBe(columns.length)
    const positions = await Promise.all(columns.map((column) => Bidi.getPosition(line, column, measure)))
    expect(positions).toEqual(positions.toSorted((a, b) => a - b))
    for (let index = 0; index < positions.length; index++) {
      // Some nested directional boundaries share a visual position.
      expect(positions).toContain(await Bidi.getPosition(line, await Bidi.getColumn(line, positions[index], measure), measure))
    }
  }
  expect(await Bidi.getPosition('\tאבג', 1, measure)).toBe(50)
})

test('logical selection splits into visual run intersections', async () => {
  expect(await Bidi.getSelectionRanges('abcאבגdef', 1, 4, measure)).toEqual([
    { width: 20, x: 10 },
    { width: 10, x: 50 },
  ])
  expect(await Bidi.getSelectionRanges('אבג', 0, 1, measure)).toEqual([{ width: 10, x: 20 }])
})

test('shift extends the active end, preserves the anchor, and crosses rows safely', () => {
  const editor = { lines: ['אבג', 'אב'], rtl: true, selections: new Uint32Array([0, 0, 0, 0]) }
  const selected = moveBidiCharacter(editor, -1, true)
  expect(selected.selections).toEqual(new Uint32Array([0, 0, 0, 1]))
  expect(moveBidiCharacter(selected, -1, true).selections).toEqual(new Uint32Array([0, 0, 0, 2]))
  expect(moveBidiCharacter({ ...editor, selections: new Uint32Array([0, 3, 0, 3]) }, -1).selections).toEqual(new Uint32Array([0, 3, 0, 3]))
  expect(moveBidiCharacter({ ...editor, selections: new Uint32Array([0, 0, 0, 0]) }, 1).selections).toEqual(new Uint32Array([1, 2, 1, 2]))
})
