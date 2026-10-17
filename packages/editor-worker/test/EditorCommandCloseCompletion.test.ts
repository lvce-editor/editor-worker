import { beforeEach, expect, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'
import * as EditorCommandCloseCompletion from '../src/parts/EditorCommand/EditorCommandCloseCompletion.ts'
import * as WidgetRevision from '../src/parts/WidgetRevision/WidgetRevision.ts'

beforeEach(() => {
  WidgetRevision.reset()
})

test('closeCompletion removes the completion widget and its additional focus', () => {
  const editor = {
    additionalFocus: 9,
    focused: true,
    widgets: [
      {
        id: WidgetId.Completion,
        newState: { uid: 2 },
        oldState: { uid: 2 },
      },
    ],
  }

  expect(EditorCommandCloseCompletion.closeCompletion(editor)).toEqual({
    ...editor,
    additionalFocus: 0,
    widgetRevision: 1,
    widgets: [],
  })
})

test('closeCompletion returns the editor unchanged when completion is not open', () => {
  const editor = {
    additionalFocus: 0,
    focused: true,
    widgets: [],
  }

  expect(EditorCommandCloseCompletion.closeCompletion(editor)).toBe(editor)
})
