import * as assert from 'assert'

export const test = async (rpc) => {
  await rpc.invoke('Editor.create', {
    id: 0,
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
  await rpc.invoke('Editor.cursorSet', 0, 0, 1)
  await rpc.invoke('Editor.openCompletion', 0)
  await rpc.invoke('EditorCompletion.openDetails', 0)
  const { commands } = await rpc.invoke('EditorCompletion.closeDetails', 0)
  assert.strictEqual(commands[8][0], 'Viewlet.send')
  assert.strictEqual(commands[8][2], 'dispose')
}
