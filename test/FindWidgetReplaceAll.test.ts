import { expect, test } from '@jest/globals'
import * as FindWidgetFactory from '../src/parts/FindWidgetFactory/FindWidgetFactory.ts'
import * as FindWidgetReplaceAll from '../src/parts/FindWidgetReplaceAll/FindWidgetReplaceAll.ts'
import type { FindWidgetState } from '../src/parts/FindWidgetState/FindWidgetState.ts'
import * as WidgetId from '../src/parts/WidgetId/WidgetId.ts'

test('replaceAll - single replacement', () => {
  const { oldState } = FindWidgetFactory.create()
  const state: FindWidgetState = {
    ...oldState,
    replaceExpanded: true,
    matches: new Uint32Array([0, 0]),
    value: 'b',
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
  }
  const newEditor = FindWidgetReplaceAll.replaceAll(editor)
  expect(newEditor.lines).toEqual(['b'])
})

test('replaceAll - two replacements in one line', () => {
  const { oldState } = FindWidgetFactory.create()
  const state: FindWidgetState = {
    ...oldState,
    replaceExpanded: true,
    matches: new Uint32Array([0, 0]),
    value: 'b',
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
  }
  const newEditor = FindWidgetReplaceAll.replaceAll(editor)
  expect(newEditor.lines).toEqual(['bb'])
})

test('replaceAll - two replacements in two lines', () => {
  const { oldState } = FindWidgetFactory.create()
  const state: FindWidgetState = {
    ...oldState,
    replaceExpanded: true,
    matches: new Uint32Array([0, 0]),
    value: 'b',
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
  }
  const newEditor = FindWidgetReplaceAll.replaceAll(editor)
  expect(newEditor.lines).toEqual(['b', 'b'])
})
