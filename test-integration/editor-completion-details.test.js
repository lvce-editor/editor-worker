import * as assert from 'assert'

export const test = async ({ Editor, EditorCompletion }) => {
  await Editor.create({
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
  await Editor.cursorSet(0, 0, 1)
  await Editor.openCompletion(0)
  const { commands } = await EditorCompletion.openDetails(0)
  assert.strictEqual(commands[5][0], 'Viewlet.setDom2')
  const dom = commands[5][2]
  assert.deepEqual(dom, [
    {
      type: 4,
      className: 'Viewlet EditorCompletionDetails',
      childCount: 2,
    },
    { type: 4, className: 'CompletionDetailContent', childCount: 1 },
    { type: 12, text: 'abc', childCount: 0 },
    {
      type: 4,
      className: 'CompletionDetailCloseButton',
      onClick: 'handleClose',
      childCount: 1,
    },
    { type: 4, className: 'MaskIcon IconClose', childCount: 0 },
  ])
}
