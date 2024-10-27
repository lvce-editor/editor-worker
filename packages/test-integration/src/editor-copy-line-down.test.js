import * as assert from 'assert'

export const test = async (rpc) => {
  await rpc.invoke('Editor.create', {
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
  await rpc.invoke('Editor.cursorSet', 0, 0, 0)
  await rpc.invoke('Editor.copyLineDown', 0)
  const text = await rpc.invoke('Editor.getText', 0)
  assert.strictEqual(
    text,
    `abc
abc`,
  )
}
