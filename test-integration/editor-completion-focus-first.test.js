import * as assert from 'assert'

const id = 0

export const test = async ({ Editor, EditorCompletion }) => {
  await Editor.create({
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
  await Editor.cursorSet(id, 0, 1)
  await Editor.openCompletion(id)
  await EditorCompletion.focusIndex(id, 1)
  const { commands } = await EditorCompletion.focusFirst(id)
  assert.strictEqual(commands[4][2], 'setDom')
  assert.deepEqual(commands[4][3], [
    { type: 4, childCount: 2 },
    {
      type: 4,
      role: 'option',
      className: 'EditorCompletionItem EditorCompletionItemFocused',
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
      className: 'EditorCompletionItem',
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
