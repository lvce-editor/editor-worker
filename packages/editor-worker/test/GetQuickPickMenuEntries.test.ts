import { expect, test } from '@jest/globals'
import { getQuickPickMenuEntries } from '../src/parts/GetQuickPickMenuEntries/GetQuickPickMenuEntries.ts'

test('includes Toggle Breakpoint', () => {
  expect(getQuickPickMenuEntries()).toContainEqual({
    id: 'Editor.toggleBreakpoint',
    label: 'Toggle Breakpoint',
  })
})

test('includes folding commands', () => {
  expect(getQuickPickMenuEntries()).toEqual(
    expect.arrayContaining([
      {
        id: 'Editor.fold',
        label: 'Editor: Fold',
      },
      {
        id: 'Editor.unfold',
        label: 'Editor: Unfold',
      },
    ]),
  )
})
