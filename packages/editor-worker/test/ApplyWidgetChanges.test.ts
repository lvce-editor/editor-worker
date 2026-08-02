import { beforeEach, expect, test } from '@jest/globals'
import * as ApplyWidgetChanges from '../src/parts/ApplyWidgetChanges/ApplyWidgetChanges.ts'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as WidgetRegistry from '../src/parts/WidgetRegistry/WidgetRegistry.ts'

const id = 1

beforeEach(() => {
  WidgetRegistry.set(id, {
    handleEditorDeleteLeft: (editor: any) => ({
      ...editor,
      updated: true,
    }),
    handleEditorType: (editor: any) => ({
      ...editor,
      updated: true,
    }),
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
    ...editor,
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
  expect(await ApplyWidgetChanges.applyWidgetChanges(editor, changes)).toBe(editor)
})

test('applyWidgetChanges preserves editor identity for unrelated edits', async () => {
  const editor = {
    id: 123,
    lines: ['before'],
    uid: 123,
    widgets: [
      {
        id,
        newState: {},
        oldState: {},
      },
    ],
  }
  const changes = [
    {
      deleted: ['before'],
      inserted: ['after'],
      origin: EditOrigin.Format,
    },
  ]

  await expect(ApplyWidgetChanges.applyWidgetChanges(editor, changes)).resolves.toBe(editor)
})

test('applyWidgetChanges passes each widget the latest editor', async () => {
  const secondId = 2
  WidgetRegistry.set(secondId, {
    handleEditorType: (editor: any) => ({
      ...editor,
      secondUpdated: editor.updated,
    }),
  })
  const editor = {
    lines: ['before'],
    widgets: [
      { id, newState: {}, oldState: {} },
      { id: secondId, newState: {}, oldState: {} },
    ],
  }
  const changes = [
    {
      deleted: [],
      inserted: ['a'],
      origin: EditOrigin.EditorType,
    },
  ]

  await expect(ApplyWidgetChanges.applyWidgetChanges(editor, changes)).resolves.toEqual({
    ...editor,
    secondUpdated: true,
    updated: true,
  })
})
