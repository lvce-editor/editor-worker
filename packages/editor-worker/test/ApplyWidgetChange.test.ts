import { beforeEach, expect, test } from '@jest/globals'
import * as ApplyWidgetChange from '../src/parts/ApplyWidgetChange/ApplyWidgetChange.ts'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as WidgetRegistry from '../src/parts/WidgetRegistry/WidgetRegistry.ts'

const id = 1

beforeEach(() => {
  WidgetRegistry.set(id, {
    handleEditorType(editor: any, state: any) {
      return {
        ...state,
        updated: true,
      }
    },
    handleEditorDeleteLeft(editor: any, state: any) {
      return {
        ...state,
        updated: true,
      }
    },
  })
})

test('applyWidgetChange - type', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
    lineCache: [],
  }
  const widget = {
    id,
    oldState: {
      updated: false,
    },
    newState: {
      updated: false,
    },
  }
  const changes = [
    {
      origin: EditOrigin.EditorType,
      inserted: ['a'],
      deleted: [],
    },
  ]
  expect((await ApplyWidgetChange.applyWidgetChange(editor, widget, changes)).newState).toEqual(undefined)
})

test('applyWidgetChange - deleteLeft', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
    lineCache: [],
  }
  const widget = {
    id,
    oldState: {
      updated: false,
    },
    newState: {
      updated: false,
    },
  }
  const changes = [
    {
      origin: EditOrigin.DeleteLeft,
      inserted: [''],
      deleted: ['a'],
    },
  ]
  expect((await ApplyWidgetChange.applyWidgetChange(editor, widget, changes)).newState).toEqual(undefined)
})

test('applyWidgetChange - other', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
    lineCache: [],
  }
  const widget = {
    id,
    oldState: {
      updated: false,
    },
    newState: {
      updated: false,
    },
  }
  const changes = [
    {
      origin: EditOrigin.Unknown,
      inserted: ['a'],
      deleted: [],
    },
  ]
  expect((await ApplyWidgetChange.applyWidgetChange(editor, widget, changes)).newState).toEqual({
    updated: false,
  })
})
