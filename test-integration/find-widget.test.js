import * as assert from 'node:assert'

const id = 0

export const test = async (rpc) => {
  await rpc.invoke('Editor.create', {
    id,
    content: 'abc',
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
  await rpc.invoke('Editor.cursorSet', id, 0, 0)
  await rpc.invoke('Editor.selectWord', id, 0, 0)
  const response = await rpc.invoke('Editor.openFind2', id)
  assert.strictEqual(response.commands[4][0], 'Viewlet.createFunctionalRoot')
  assert.deepEqual(response.commands[5][2], [
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
      childCount: 1,
      'data-command': 'toggleReplace',
      onClick: 'handleClickToggleReplace',
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
    { type: 12, text: '1 of 1', childCount: 0 },
    {
      type: 1,
      className: 'IconButton',
      title: 'Previous Match',
      ariaLabel: 'Previous Match',
      childCount: 1,
      disabled: undefined,
      onClick: 'handleClickPreviousMatch',
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
    },
    {
      type: 4,
      className: 'MaskIcon MaskIconClose',
      role: 'none',
      childCount: 0,
    },
  ])
}
