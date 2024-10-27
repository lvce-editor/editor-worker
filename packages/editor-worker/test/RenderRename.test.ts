import { expect, test } from '@jest/globals'
import * as RenderRename from '../src/parts/RenderRename/RenderRename.ts'
import * as RenameWidgetFactory from '../src/parts/RenameWidgetFactory/RenameWidgetFactory.ts'
import type { RenameState } from '../src/parts/RenameState/RenameState.ts'

test('renderRename', () => {
  const widget = RenameWidgetFactory.create()
  const state: RenameState = {
    ...widget.newState,
    oldValue: 'a',
    newValue: 'b',
  }
  expect(RenderRename.renderRename(state)).toEqual([
    {
      childCount: 1,
      className: 'Viewlet EditorRename',
      type: 4,
    },
    {
      childCount: 0,
      className: 'InputBox RenameInputBox',
      type: 6,
      value: 'b',
    },
  ])
})
