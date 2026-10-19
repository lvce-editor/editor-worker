import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-cursor-down-column'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `first\ns`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 5)

  await Editor.cursorDown()

  await Editor.shouldHaveSelections(new Uint32Array([1, 1, 1, 1]))
}
