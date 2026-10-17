import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.context-menu-preserve-selection'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'worker')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 6]))

  // act
  await Command.execute('Editor.handleMouseDown', 2, false, false, 80, 40, 1)
  await Command.execute('Editor.handleContextMenu', 2, 80, 40)

  // assert
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 6]))
}
