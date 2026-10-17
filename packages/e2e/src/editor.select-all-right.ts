import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-all-right'

export const skip = 1

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `  abc`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 2)

  await Editor.selectAllRight()

  await Editor.shouldHaveSelections(new Uint32Array([0, 2, 0, 5]))
}
