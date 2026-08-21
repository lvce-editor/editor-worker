import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.move-line-down-shortcut'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo\nthree')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 1)

  const alt = 1 << 9
  const downArrow = 16
  await Command.execute('KeyBindings.handleKeyBinding', alt | downArrow)

  await Editor.shouldHaveText('two\none\nthree')
  await Editor.shouldHaveSelections(new Uint32Array([1, 1, 1, 1]))
}
