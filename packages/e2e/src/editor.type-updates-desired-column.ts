import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-type-updates-desired-column'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '1234\n1234567890')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 3)

  await Editor.type('juhu')
  await Editor.cursorDown()

  await Editor.shouldHaveSelections(new Uint32Array([1, 7, 1, 7]))
}
