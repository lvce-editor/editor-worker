import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.move-line-up-shortcut'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo\nthree')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([1, 1, 2, 3]))

  const alt = 1 << 9
  const upArrow = 14
  await Command.execute('KeyBindings.handleKeyBinding', alt | upArrow)

  await Editor.shouldHaveText('two\nthree\none')
  await Editor.shouldHaveSelections(new Uint32Array([0, 1, 1, 3]))
}
