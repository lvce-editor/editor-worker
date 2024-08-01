import * as assert from 'assert'

export const test = async (rpc) => {
  await rpc.invoke('Editor.create', {
    id: 0,
    content: 'abc\nabc',
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
  await rpc.invoke('Editor.cursorSet', 0, 0, 0)
  await rpc.invoke('Editor.cursorDown', 0)
  const selections = await rpc.invoke('Editor.getSelections', 0)
  assert.strictEqual(selections, new Uint32Array([1, 0]))
}
