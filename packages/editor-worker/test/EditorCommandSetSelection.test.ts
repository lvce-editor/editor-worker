import { expect, test } from '@jest/globals'
import * as EditorCommandSetSelections from '../src/parts/EditorCommand/EditorCommandSetSelections.ts'

test('setSelections', () => {
  const editor = {
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    selections: new Uint32Array([0, 0, 0, 0]),
  }
  expect(EditorCommandSetSelections.setSelections(editor, new Uint32Array([0, 0, 0, 1]))).toMatchObject({
    selections: new Uint32Array([0, 0, 0, 1]),
  })
})

test('setSelections - scroll down', () => {
  const editor = {
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    maxLineY: 1,
    minLineY: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
  }
  expect(EditorCommandSetSelections.setSelections(editor, new Uint32Array([2, 0, 2, 0]))).toMatchObject({
    maxLineY: 3,
    minLineY: 2,
    selections: new Uint32Array([2, 0, 2, 0]),
  })
})

test('setSelections - scroll up', () => {
  const editor = {
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    maxLineY: 3,
    minLineY: 2,
    selections: new Uint32Array([2, 0, 0, 2]),
  }
  expect(EditorCommandSetSelections.setSelections(editor, new Uint32Array([0, 0, 0, 0]))).toMatchObject({
    maxLineY: 1,
    minLineY: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
  })
})
