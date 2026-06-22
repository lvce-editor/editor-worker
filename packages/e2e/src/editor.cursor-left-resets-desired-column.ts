import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-left-resets-desired-column'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '123456\n12')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 6)

  await Editor.cursorDown()
  await Editor.shouldHaveSelections(new Uint32Array([1, 6, 1, 6]))

  await Editor.cursorCharacterLeft()
  await Editor.cursorUp()

  await Editor.shouldHaveSelections(new Uint32Array([0, 5, 0, 5]))
}
