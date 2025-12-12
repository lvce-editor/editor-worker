import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-word'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `command_exists\n`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 8)

  // act
  await Command.execute('Editor.selectNextOccurrence')

  // assert
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 14])) //TODO
}
