import { expect, test } from '@jest/globals'
import * as GetFindWidgetVirtualDom from '../src/parts/GetFindWidgetVirtualDom/GetFindWidgetVirtualDom.ts'

test('getFindWidgetVirtualDom', () => {
  const matchCountText = '1 of 3'
  const replaceExpanded = false
  const buttons = [
    {
      label: 'Previous Match',
      icon: 'ArrowUp',
      disabled: false,
    },
    {
      label: 'Next Match',
      icon: 'ArrowDown',
      disabled: false,
    },
    {
      label: 'Close',
      icon: 'Close',
      disabled: false,
    },
  ]
  const matchCase = false
  const matchWholeWord = false
  const useRegularExpression = false
  const dom = GetFindWidgetVirtualDom.getFindWidgetVirtualDom(
    matchCountText,
    replaceExpanded,
    buttons,
    matchCase,
    matchWholeWord,
    useRegularExpression
  )
  expect(dom).toEqual([
    {
      childCount: 2,
      className: 'Viewlet ViewletFind ViewletFindWidget FindWidget',
      role: 'group',
      type: 4,
    },
    {
      ariaExpanded: false,
      ariaLabel: 'Toggle Replace',
      childCount: 1,
      className: 'IconButton SearchToggleButton ',
      'data-command': 'toggleReplace',
      onClick: 'handleClick',
      title: 'Toggle Replace',
      type: 1,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconChevronRight',
      type: 4,
    },
    {
      childCount: 1,
      className: 'FindWidgetRight',
      type: 4,
    },
    {
      childCount: 5,
      className: 'FindWidgetFind',
      type: 4,
    },
    {
      childCount: 2,
      className: 'SearchField',
      role: 'none',
      type: 4,
    },
    {
      autocapitalize: 'off',
      autocorrect: 'off',
      childCount: 0,
      className: 'MultilineInputBox',
      name: 'search-value',
      onFocus: 'handleFocus',
      onInput: 'handleInput',
      placeholder: 'Find',
      spellcheck: false,
      type: 62,
    },
    {
      childCount: 0,
      className: 'SearchFieldButtons',
      type: 4,
    },
    {
      childCount: 1,
      className: 'FindWidgetMatchCount',
      type: 4,
    },
    {
      childCount: 0,
      text: '1 of 3',
      type: 12,
    },
    {
      ariaLabel: 'Previous Match',
      childCount: 1,
      className: 'IconButton',
      disabled: undefined,
      title: 'Previous Match',
      type: 1,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconArrowUp',
      role: 'none',
      type: 4,
    },
    {
      ariaLabel: 'Next Match',
      childCount: 1,
      className: 'IconButton',
      disabled: undefined,
      title: 'Next Match',
      type: 1,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconArrowDown',
      role: 'none',
      type: 4,
    },
    {
      ariaLabel: 'Close',
      childCount: 1,
      className: 'IconButton',
      disabled: undefined,
      title: 'Close',
      type: 1,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconClose',
      role: 'none',
      type: 4,
    },
  ])
})