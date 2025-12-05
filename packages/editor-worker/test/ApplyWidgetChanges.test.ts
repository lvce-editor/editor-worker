import { beforeEach, expect, test } from '@jest/globals'
import * as ApplyWidgetChanges from '../src/parts/ApplyWidgetChanges/ApplyWidgetChanges.ts'
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

test('applyWidgetChanges - delete', async () => {
  const editor = {
    cursor: {
      columnIndex: 4,
      rowIndex: 0,
    },
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(0, 0, 0, 4),
    widgets: [
      {
        id: id,
        newState: {
          updated: false,
        },
        oldState: {
          updated: false,
        },
      },
    ],
  }
  const changes = [
    {
      deleted: ['a'],
      inserted: [''],
      origin: EditOrigin.DeleteLeft,
    },
  ]
  expect(await ApplyWidgetChanges.applyWidgetChanges(editor, changes)).toEqual({
    updated: true,
  })
})

test('applyWidgetChanges - empty widgets', async () => {
  const editor = {
    cursor: {
      columnIndex: 4,
      rowIndex: 0,
    },
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(0, 0, 0, 4),
    widgets: [],
  }
  const changes = [
    {
      deleted: ['a'],
      inserted: [''],
      origin: EditOrigin.DeleteLeft,
    },
  ]
  expect(await ApplyWidgetChanges.applyWidgetChanges(editor, changes)).toEqual([])
})
