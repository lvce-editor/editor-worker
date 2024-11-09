import * as assert from 'assert'

export const test = async ({ Editor }) => {
  await Editor.create({
    id: 0,
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
  await Editor.cursorSet(0, 0, 3)
  await Editor.type(0, 'd')
  const selections = await Editor.getSelections(0)
  assert.deepEqual(selections, new Uint32Array([0, 4, 0, 4]))
  const text = await Editor.getText(0)
  assert.deepEqual(text, 'abcd')
}
