import * as assert from 'assert'

const id = 0

export const test = async ({ Editor }) => {
  await Editor.create({
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
  await Editor.cursorSet(id, 0, 3)
  const { commands } = await Editor.openRename(id)
  assert.equal(commands[5][0], 'Viewlet.setDom2')
  assert.deepEqual(commands[5][2], [
    { type: 4, className: 'Viewlet EditorRename', childCount: 1 },
    {
      type: 6,
      className: 'InputBox RenameInputBox',
      value: 'abc',
      childCount: 0,
      onBlur: 'handleBlur',
    },
  ])
}
