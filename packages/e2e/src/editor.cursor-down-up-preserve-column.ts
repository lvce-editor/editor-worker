import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-down-up-preserve-column'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '123456\n1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 6)

  await Editor.cursorDown()
  await Editor.shouldHaveSelections(new Uint32Array([1, 1, 1, 1]))

  await Editor.cursorUp()
  await Editor.shouldHaveSelections(new Uint32Array([0, 6, 0, 6]))
}
