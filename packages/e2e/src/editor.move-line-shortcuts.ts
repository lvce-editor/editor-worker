import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.move-line-shortcuts'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo\nthree')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)

  const downArrow = 16
  const upArrow = 14
  const shift = 1 << 10
  const control = 1 << 11
  await Command.execute('KeyBindings.handleKeyBinding', control | shift | downArrow)
  await Editor.shouldHaveText('two\none\nthree')
  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0]))

  await Command.execute('KeyBindings.handleKeyBinding', control | shift | upArrow)
  await Editor.shouldHaveText('one\ntwo\nthree')
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 0]))
}
