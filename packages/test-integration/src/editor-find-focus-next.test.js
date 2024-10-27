import * as assert from 'assert'

const id = 0

export const test = async (rpc) => {
  await rpc.invoke('Editor.create', {
    id,
    content: `a
b
a`,
    fontFamily: '',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 400,
    letterSpacing: 0.5,
    tabSize: 2,
    width: 100,
    isMonospaceFont: true,
    charWidth: 9,
  })
  await rpc.invoke('Editor.setSelections', id, new Uint32Array([0, 0, 0, 1]))
  await rpc.invoke('Editor.openFind', id)
  const { commands } = await rpc.invoke('FindWidget.focusNext', id)
  assert.deepEqual(commands[4][0], 'Viewlet.setDom2')
  assert.deepEqual(commands[4][2], [
    {
      type: 4,
      className: 'Viewlet ViewletFind ViewletFindWidget FindWidget',
      childCount: 2,
      role: 'group',
    },
    {
      type: 1,
      className: 'IconButton SearchToggleButton ',
      title: 'Toggle Replace',
      ariaLabel: 'Toggle Replace',
      ariaExpanded: false,
      name: 'ToggleReplace',
      childCount: 1,
      'data-command': 'toggleReplace',
      onClick: 'handleClickToggleReplace',
      onFocus: 'handleToggleReplaceFocus',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconChevronRight',
      childCount: 0,
    },
    { type: 4, className: 'FindWidgetRight', childCount: 1 },
    { type: 4, className: 'FindWidgetFind', childCount: 5 },
    { type: 4, className: 'SearchField', role: 'none', childCount: 2 },
    {
      type: 62,
      className: 'MultilineInputBox',
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: 'Find',
      name: 'search-value',
      onInput: 'handleInput',
      onFocus: 'handleFocus',
      childCount: 0,
    },
    { type: 4, className: 'SearchFieldButtons', childCount: 0 },
    { type: 4, className: 'FindWidgetMatchCount', childCount: 1 },
    { type: 12, text: '2 of 2', childCount: 0 },
    {
      type: 1,
      className: 'IconButton',
      title: 'Previous Match',
      ariaLabel: 'Previous Match',
      childCount: 1,
      disabled: undefined,
      onClick: 'handleClickPreviousMatch',
      name: 'FocusPrevious',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconArrowUp',
      role: 'none',
      childCount: 0,
    },
    {
      type: 1,
      className: 'IconButton',
      title: 'Next Match',
      ariaLabel: 'Next Match',
      childCount: 1,
      disabled: undefined,
      onClick: 'handleClickNextMatch',
      name: 'FocusNext',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconArrowDown',
      role: 'none',
      childCount: 0,
    },
    {
      type: 1,
      className: 'IconButton',
      title: 'Close',
      ariaLabel: 'Close',
      childCount: 1,
      disabled: undefined,
      onClick: 'handleClickClose',
      name: 'Close',
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconClose',
      role: 'none',
      childCount: 0,
    },
  ])
}
