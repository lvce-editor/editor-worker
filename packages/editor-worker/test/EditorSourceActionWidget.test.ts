import { expect, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'
import * as EditorSourceActionWidget from '../src/parts/EditorSourceActionWidget/EditorSourceActionWidget.ts'
import * as RenderMethod from '../src/parts/RenderMethod/RenderMethod.ts'

test('render - associates the editor uid with focus context commands', () => {
  const oldState = {
    commands: [],
    editorUid: 3,
    uid: 7,
  }
  const newState = {
    commands: [[RenderMethod.SetFocusContext, 38]],
    editorUid: 3,
    uid: 7,
  }
  const widget = {
    id: WidgetId.SourceAction,
    newState,
    oldState,
  }

  expect(EditorSourceActionWidget.render(widget as any)).toEqual([[RenderMethod.SetFocusContext, 3, 38]])
})
