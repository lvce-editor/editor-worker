import { afterEach, expect, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'
import * as EditorCancelSelection from '../src/parts/EditorCommand/EditorCommandCancelSelection.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as FocusKey from '../src/parts/FocusKey/FocusKey.ts'
import * as WidgetRevision from '../src/parts/WidgetRevision/WidgetRevision.ts'

afterEach(() => {
  WidgetRevision.reset()
})

test('editorCancelSelection', () => {
  const editor = {
    cursor: {
      columnIndex: 4,
      rowIndex: 0,
    },
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  expect(EditorCancelSelection.cancelSelection(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCancelSelection - when there is no selection', () => {
  const editor = {
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(EditorCancelSelection.cancelSelection(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
})

test('editorCancelSelection - closes an open hover before cancelling the selection', () => {
  const hover = {
    id: WidgetId.Hover,
    newState: { uid: 2 },
    oldState: { uid: 2 },
  }
  const selections = EditorSelection.fromRange(0, 0, 0, 4)
  const editor = {
    additionalFocus: FocusKey.FocusEditorHover,
    focused: true,
    lineCache: [],
    lines: ['line 1'],
    selections,
    uid: 1,
    widgetRevision: 9,
    widgets: [hover],
  }

  const result = EditorCancelSelection.cancelSelection(editor)

  expect(result).toEqual({
    ...editor,
    additionalFocus: 0,
    widgetRevision: 1,
    widgets: [],
  })
  expect(result.selections).toBe(selections)
})
