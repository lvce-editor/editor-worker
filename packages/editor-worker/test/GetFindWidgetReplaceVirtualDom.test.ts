import { expect, test } from '@jest/globals'
import type{ FindWidgetButton } from '../src/parts/FindWidgetButton/FindWidgetButton.ts'
import * as GetFindWidgetReplaceVirtualDom from '../src/parts/GetFindWidgetReplaceVirtualDom/GetFindWidgetReplaceVirtualDom.ts'

test('getFindWidgetReplaceVirtualDom', () => {
  const replaceExpanded = true
  const replaceButtons: readonly FindWidgetButton[] = [
    {
      label: 'Focus Previous',
      icon: 'ArrowUp',
      disabled: false,
      onClick: 'handleClickFocusPrevious',
      name: 'FocusPrevious',
    },
  ]
  const dom = GetFindWidgetReplaceVirtualDom.getFindWidgetReplaceVirtualDom(replaceExpanded, replaceButtons)
  expect(dom).toEqual(
      [{"childCount": 2, "className": "FindWidgetReplace", "type": 4}, {"childCount": 2, "className": "SearchField", "role": "none", "type": 4}, {"autocapitalize": "off", "autocorrect": "off", "childCount": 0, "className": "MultilineInputBox", "name": "replace-value", "onFocus": "handleReplaceFocus", "onInput": "handleReplaceInput", "placeholder": "Replace", "spellcheck": false, "type": 62}, {"childCount": 0, "className": "SearchFieldButtons", "type": 4}, {"ariaLabel": "Focus Previous", "childCount": 1, "className": "IconButton", "disabled": undefined, "name": "FocusPrevious", "onClick": "handleClickFocusPrevious", "title": "Focus Previous", "type": 1}, {"childCount": 0, "className": "MaskIcon MaskIconArrowUp", "role": "none", "type": 4}],
  )
})
