import * as assert from 'assert'

const id = 0

export const test = async (rpc) => {
  await rpc.invoke('Editor.create', {
    id,
    content: 'a',
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
  await rpc.invoke('Editor.cursorSet', id, 0, 1)
  const { commands } = await rpc.invoke('Editor.openFind', id)
  assert.deepEqual(commands[6][2], [
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
    { type: 4, className: 'FindWidgetMatchCount FindWidgetMatchCountEmpty', childCount: 1 },
    { type: 12, text: 'No Results', childCount: 0 },
    {
      type: 1,
      className: 'IconButton IconButtonDisabled',
      title: 'Previous Match',
      ariaLabel: 'Previous Match',
      childCount: 1,
      disabled: true,
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
      className: 'IconButton IconButtonDisabled',
      title: 'Next Match',
      ariaLabel: 'Next Match',
      childCount: 1,
      disabled: true,
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
