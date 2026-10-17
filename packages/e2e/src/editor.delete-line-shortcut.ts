import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.delete-line-shortcut'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'alpha\nbravo\ncharlie')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(1, 2)

  const keyK = 39
  const shift = 1 << 10
  const control = 1 << 11
  await Command.execute('KeyBindings.handleKeyBinding', control | shift | keyK)

  await Editor.shouldHaveText('alpha\ncharlie')
  await Editor.shouldHaveSelections(new Uint32Array([1, 2, 1, 2]))
}
