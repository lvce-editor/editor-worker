import * as assert from 'assert'

const id = 0

export const test = async ({ Editor, EditorRename }) => {
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
  await Editor.openRename(id)
  const { commands } = await Editor.closeRename(id)
  assert.equal(commands[4][2], 'dispose')
}
