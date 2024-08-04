import * as assert from 'assert'

export const test = async (rpc) => {
  await rpc.invoke('Editor.create', {
    id: 0,
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
  await rpc.invoke('Editor.cursorSet', 0, 0, 1)
  await rpc.invoke('Editor.openCompletion', 0)
  const { commands } = await rpc.invoke('EditorCompletion.focusNext', 0)
  assert.strictEqual(commands[4][2], 'setDom')
  assert.deepEqual(commands[4][3], [
    { type: 4, childCount: 2 },
    {
      type: 4,
      role: 'option',
      className: 'EditorCompletionItem',
      top: 0,
      childCount: 2,
    },
    {
      type: 4,
      className: 'ColoredMaskIcon SymbolDefault',
      childCount: 0,
    },
    { type: 4, className: 'Label', childCount: 2 },
    {
      type: 8,
      className: 'EditorCompletionItemHighlight',
      childCount: 1,
    },
    { type: 12, text: 'a', childCount: 0 },
    { type: 12, text: 'bc 1', childCount: 0 },
    {
      type: 4,
      role: 'option',
      className: 'EditorCompletionItem EditorCompletionItemFocused',
      top: 20,
      childCount: 2,
    },
    {
      type: 4,
      className: 'ColoredMaskIcon SymbolDefault',
      childCount: 0,
    },
    { type: 4, className: 'Label', childCount: 2 },
    {
      type: 8,
      className: 'EditorCompletionItemHighlight',
      childCount: 1,
    },
    { type: 12, text: 'a', childCount: 0 },
    { type: 12, text: 'bc 2', childCount: 0 },
  ])
}
