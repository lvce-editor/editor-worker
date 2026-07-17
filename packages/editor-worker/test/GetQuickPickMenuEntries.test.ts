import { expect, test } from '@jest/globals'
import { getQuickPickMenuEntries } from '../src/parts/GetQuickPickMenuEntries/GetQuickPickMenuEntries.ts'

test('includes Toggle Breakpoint', () => {
  expect(getQuickPickMenuEntries()).toContainEqual({
    id: 'Editor.toggleBreakpoint',
    label: 'Toggle Breakpoint',
  })
})
