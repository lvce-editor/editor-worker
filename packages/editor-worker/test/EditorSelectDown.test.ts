import { expect, test } from '@jest/globals'
import * as EditorSelectDown from '../src/parts/EditorCommand/EditorCommandSelectDown.ts'

test('selectDown', () => {
  const editor = {
    lineCache: [],
    lines: ['1', '2'],
    selections: new Uint32Array([0, 0, 0, 0]),
  }
  const newEditor = EditorSelectDown.selectDown(editor)
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 1, 0]))
})

test('selectDown - already at bottom', () => {
  const editor = {
    lineCache: [],
    lines: ['1', '2'],
    selections: new Uint32Array([0, 0, 1, 0]),
  }
  const newEditor = EditorSelectDown.selectDown(editor)
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 1, 0]))
})

test('selectDown - keep indent', () => {
  const editor = {
    lineCache: [],
    lines: ['11', '22'],
    selections: new Uint32Array([0, 1, 0, 1]),
  }
  const newEditor = EditorSelectDown.selectDown(editor)
  expect(newEditor.selections).toEqual(new Uint32Array([0, 1, 1, 1]))
})

test('selectDown - scrolls to reveal the active end', () => {
  const editor = {
    deltaY: 0,
    finalDeltaY: 60,
    height: 40,
    itemHeight: 20,
    lineCache: [],
    lines: ['1', '2', '3', '4', '5'],
    maxLineY: 2,
    minLineY: 0,
    numberOfVisibleLines: 2,
    primarySelectionIndex: 0,
    scrollBarHeight: 20,
    selections: new Uint32Array([0, 0, 1, 0]),
  }
  const newEditor = EditorSelectDown.selectDown(editor)
  expect(newEditor).toMatchObject({
    deltaY: 20,
    maxLineY: 3,
    minLineY: 1,
    selections: new Uint32Array([0, 0, 2, 0]),
  })
})
