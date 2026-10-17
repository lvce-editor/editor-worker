import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.increment-selection-shortcuts'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'count = 41')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 9)

  const alt = 1 << 9
  const control = 1 << 11
  const keyD = 32
  const keyI = 37
  await Command.execute('KeyBindings.handleKeyBinding', control | alt | keyI)
  await Editor.shouldHaveText('count = 42')

  await Command.execute('KeyBindings.handleKeyBinding', control | alt | keyD)
  await Editor.shouldHaveText('count = 41')
  await Editor.shouldHaveSelections(new Uint32Array([0, 9, 0, 9]))
}
