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
