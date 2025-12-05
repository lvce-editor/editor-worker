import { beforeEach, expect, test } from '@jest/globals'
import * as ApplyWidgetChange from '../src/parts/ApplyWidgetChange/ApplyWidgetChange.ts'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as WidgetRegistry from '../src/parts/WidgetRegistry/WidgetRegistry.ts'

const id = 1

beforeEach(() => {
  WidgetRegistry.set(id, {
    handleEditorDeleteLeft(editor: any, state: any) {
      return {
        ...state,
        updated: true,
      }
    },
    handleEditorType(editor: any, state: any) {
      return {
        ...state,
        updated: true,
      }
    },
  })
})

test('applyWidgetChange - type', async () => {
  const editor = {
    cursor: {
      columnIndex: 4,
      rowIndex: 0,
    },
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  const widget = {
    id,
    newState: {
      updated: false,
    },
    oldState: {
      updated: false,
    },
  }
  const changes = [
    {
      deleted: [],
      inserted: ['a'],
      origin: EditOrigin.EditorType,
    },
  ]
  expect((await ApplyWidgetChange.applyWidgetChange(editor, widget, changes)).newState).toEqual(undefined)
})

test('applyWidgetChange - deleteLeft', async () => {
  const editor = {
    cursor: {
      columnIndex: 4,
      rowIndex: 0,
    },
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  const widget = {
    id,
    newState: {
      updated: false,
    },
    oldState: {
      updated: false,
    },
  }
  const changes = [
    {
      deleted: ['a'],
      inserted: [''],
      origin: EditOrigin.DeleteLeft,
    },
  ]
  expect((await ApplyWidgetChange.applyWidgetChange(editor, widget, changes)).newState).toEqual(undefined)
})

test('applyWidgetChange - other', async () => {
  const editor = {
    cursor: {
      columnIndex: 4,
      rowIndex: 0,
    },
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  const widget = {
    id,
    newState: {
      updated: false,
    },
    oldState: {
      updated: false,
    },
  }
  const changes = [
    {
      deleted: [],
      inserted: ['a'],
      origin: EditOrigin.Unknown,
    },
  ]
  expect((await ApplyWidgetChange.applyWidgetChange(editor, widget, changes)).newState).toEqual({
    updated: false,
  })
})
