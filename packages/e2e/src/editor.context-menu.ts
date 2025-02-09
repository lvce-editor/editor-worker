import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.context-menu'

export const skip = 1

export const test: Test = async ({ Extension, FileSystem, Workspace, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.xyz`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.xyz`)
  await Editor.setCursor(0, 0)

  // act
  await Editor.openContextMenu()

  // assert
  // TODO
  const completions = Locator('.EditorCompletion')
}
