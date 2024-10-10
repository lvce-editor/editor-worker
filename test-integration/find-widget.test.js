import * as assert from 'node:assert'

const id = 0

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
  await rpc.invoke('Editor.cursorSet', id, 0, 0)
  await rpc.invoke('Editor.selectWord', id, 0, 0)
  await rpc.invoke('Editor.openFind2', id)
  const response = await rpc.invoke('FindWidget.focusIndex', id, 0)
  assert.deepEqual(response.commands, {
    value: '',
    matches: new Uint32Array([0, 0]),
    matchIndex: 1,
  })
}
