import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.gutter-disabled'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  // arrange
  await Settings.update({ 'editor.lineNumbers': false })
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/file1.txt`
  await FileSystem.writeFile(filePath, 'line 1\nline 2')
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(filePath)

  // assert
  const editorContent = Locator('.EditorContent')
  const gutter = Locator('.Gutter')
  await expect(editorContent).toBeVisible()
  await expect(gutter).toHaveCount(0)
}
