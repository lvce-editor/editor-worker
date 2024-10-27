import { expect, test } from '@jest/globals'
import * as FindWidgetFactory from '../src/parts/FindWidgetFactory/FindWidgetFactory.ts'
import * as FindWidgetReplaceAll from '../src/parts/FindWidgetReplaceAll/FindWidgetReplaceAll.ts'
import type { FindWidgetState } from '../src/parts/FindWidgetState/FindWidgetState.ts'
import * as GetFindState from '../src/parts/GetFindState/GetFindState.ts'
import * as WidgetId from '../src/parts/WidgetId/WidgetId.ts'

test('replaceAll - no find widget open', async () => {
  const editor = {
    lines: ['a'],
    widgets: [],
    undoStack: [],
  }
  const newEditor = await FindWidgetReplaceAll.replaceAll(editor)
  expect(newEditor).toBe(editor)
})

test('replaceAll - single replacement', async () => {
  const { oldState } = FindWidgetFactory.create()
  const state: FindWidgetState = {
    ...oldState,
    replaceExpanded: true,
    matches: new Uint32Array([0, 0]),
    value: 'a',
    replacement: 'b',
  }
  const editor = {
    lines: ['a'],
    widgets: [
      {
        oldState: state,
        newState: state,
        id: WidgetId.Find,
      },
    ],
    undoStack: [],
  }
  const newEditor = await FindWidgetReplaceAll.replaceAll(editor)
  expect(newEditor.lines).toEqual(['b'])
  const findState = GetFindState.getFindState(editor)
  if (!findState) {
    throw new Error('expected find state to be defined')
  }
  expect(findState.matchCount).toBe(0)
})

test.skip('replaceAll - two replacements in one line', async () => {
  const { oldState } = FindWidgetFactory.create()
  const state: FindWidgetState = {
    ...oldState,
    replaceExpanded: true,
    matches: new Uint32Array([0, 0]),
    value: 'a',
    replacement: 'b',
  }
  const editor = {
    lines: ['aa'],
    widgets: [
      {
        oldState: state,
        newState: state,
        id: WidgetId.Find,
      },
    ],
    undoStack: [],
  }
  const newEditor = await FindWidgetReplaceAll.replaceAll(editor)
  expect(newEditor.lines).toEqual(['bb'])
})

test.skip('replaceAll - two replacements in two lines', async () => {
  const { oldState } = FindWidgetFactory.create()
  const state: FindWidgetState = {
    ...oldState,
    replaceExpanded: true,
    matches: new Uint32Array([0, 0]),
    value: 'a',
    replacement: 'b',
  }
  const editor = {
    lines: ['a', 'a'],
    widgets: [
      {
        oldState: state,
        newState: state,
        id: WidgetId.Find,
      },
    ],
    undoStack: [],
  }
  const newEditor = await FindWidgetReplaceAll.replaceAll(editor)
  expect(newEditor.lines).toEqual(['b', 'b'])
})
