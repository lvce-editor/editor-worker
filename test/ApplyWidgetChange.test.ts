import { expect, test } from '@jest/globals'
import * as ApplyWidgetChange from '../src/parts/ApplyWidgetChange/ApplyWidgetChange.ts'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('applyWidgetChange - type', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  const widget = {
    handleEditorType(editor: any, state: any) {
      return {
        ...state,
        updated: true,
      }
    },
    oldState: {
      updated: false,
    },
    newState: {
      updated: false,
    },
  }
  const changes = [
    {
      type: EditOrigin.EditorType,
      inserted: ['a'],
      deleted: [],
    },
  ]
  expect(ApplyWidgetChange.applyWidgetChange(editor, widget, changes)).toEqual({
    updated: true,
  })
})

test('applyWidgetChange - deleteLeft', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  const widget = {
    handleEditorDeleteLeft(editor: any, state: any) {
      return {
        ...state,
        updated: true,
      }
    },
    oldState: {
      updated: false,
    },
    newState: {
      updated: false,
    },
  }
  const changes = [
    {
      type: EditOrigin.DeleteLeft,
      inserted: [''],
      deleted: ['a'],
    },
  ]
  expect(ApplyWidgetChange.applyWidgetChange(editor, widget, changes)).toEqual({
    updated: true,
  })
})
