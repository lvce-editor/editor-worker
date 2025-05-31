import { beforeEach, expect, test } from '@jest/globals'
import * as ApplyWidgetChanges from '../src/parts/ApplyWidgetChanges/ApplyWidgetChanges.ts'
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

test('applyWidgetChanges - delete', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
    widgets: [
      {
        id: id,
        oldState: {
          updated: false,
        },
        newState: {
          updated: false,
        },
      },
    ],
  }
  const changes = [
    {
      origin: EditOrigin.DeleteLeft,
      inserted: [''],
      deleted: ['a'],
    },
  ]
  expect(await ApplyWidgetChanges.applyWidgetChanges(editor, changes)).toEqual([
    {
      id,
      oldState: {
        updated: false,
      },
      newState: {
        updated: true,
      },
    },
  ])
})

test('applyWidgetChanges - empty widgets', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
    widgets: [],
  }
  const changes = [
    {
      origin: EditOrigin.DeleteLeft,
      inserted: [''],
      deleted: ['a'],
    },
  ]
  expect(await ApplyWidgetChanges.applyWidgetChanges(editor, changes)).toEqual([])
})
