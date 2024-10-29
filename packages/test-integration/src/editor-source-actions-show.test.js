import * as assert from 'assert'

const id = 0

export const test = async ({ Editor }) => {
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
  const { commands } = await Editor.showSourceActions(id)
  assert.deepEqual(commands[5][2], [
    {
      type: 4,
      className: 'Viewlet EditorSourceActions',
      tabIndex: -1,
      childCount: 2,
      onFocusIn: 'handleFocusIn',
    },
    { type: 4, className: 'SourceActionHeading', childCount: 1 },
    { type: 12, text: 'Source Action', childCount: 0 },
    {
      type: 4,
      className: 'EditorSourceActionsList',
      childCount: 0,
      onClick: 'handleClick',
    },
  ])
}
