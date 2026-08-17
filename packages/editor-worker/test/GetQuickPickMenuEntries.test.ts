import { expect, test } from '@jest/globals'
import { getQuickPickMenuEntries } from '../src/parts/GetQuickPickMenuEntries/GetQuickPickMenuEntries.ts'

test('includes Toggle Breakpoint', () => {
  expect(getQuickPickMenuEntries()).toContainEqual({
    id: 'Editor.toggleBreakpoint',
    label: 'Toggle Breakpoint',
  })
})

test('includes Delete Line', () => {
  expect(getQuickPickMenuEntries()).toContainEqual({
    id: 'Editor.deleteLine',
    label: 'Delete Line',
  })
})

test('includes selected value commands', () => {
  expect(getQuickPickMenuEntries()).toEqual(
    expect.arrayContaining([
      {
        id: 'Editor.incrementSelection',
        label: 'Editor: Increment Selection',
      },
      {
        id: 'Editor.decrementSelection',
        label: 'Editor: Decrement Selection',
      },
    ]),
  )
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

test('includes undo commands', () => {
  expect(getQuickPickMenuEntries()).toEqual(
    expect.arrayContaining([
      {
        id: 'Editor.undo',
        label: 'Undo',
      },
      {
        id: 'Editor.redo',
        label: 'Redo',
      },
      {
        id: 'Editor.cursorUndo',
        label: 'Cursor Undo',
      },
    ]),
  )
})
