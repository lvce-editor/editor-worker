import * as assert from 'assert'

const id = 0

export const test = async ({ Editor }) => {
  await Editor.create({
    id,
    content: '// abc',
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
  await Editor.cursorSet(id, 0, 0)
  await Editor.toggleComment(id)
  const text = await Editor.getText(id)
  assert.deepEqual(text, 'abc')
}
