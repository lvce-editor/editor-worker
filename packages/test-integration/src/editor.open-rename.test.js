import * as assert from 'assert'

const id = 0
export const skip = true

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
  await rpc.invoke('Editor.cursorSet', id, 0, 3)
  const commands = await rpc.invoke('Editor.openRename', id)
  // TODO check commands
  console.log({ commands })
  assert.equal(1, 1)
}
