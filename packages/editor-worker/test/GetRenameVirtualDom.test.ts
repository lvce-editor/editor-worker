import { expect, test } from '@jest/globals'
import * as GetRenameVirtualDom from '../src/parts/GetRenameVirtualDom/GetRenameVirtualDom.ts'
import type { RenameState } from '../src/parts/RenameState/RenameState.ts'
import * as RenameWidgetFactory from '../src/parts/RenameWidgetFactory/RenameWidgetFactory.ts'

test('getRenameVirtualDom', () => {
  const widget = RenameWidgetFactory.create()
  const state: RenameState = {
    ...widget.newState,
    oldValue: 'a',
    newValue: 'b',
  }
  expect(GetRenameVirtualDom.getRenameVirtualDom(state)).toEqual([
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
      onBlur: 'handleBlur',
    },
  ])
})
