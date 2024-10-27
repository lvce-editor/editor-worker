import * as assert from 'assert'

const id = 1

export const skip = true

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
  await rpc.invoke('Editor.handleTab', id)
  const newText = await rpc.invoke('Editor.getText', id)
  assert.strictEqual(newText, '<a></a>')
}
