import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-new-file-opens-writable-editor'

export const skip = 1

export const test: Test = async ({ SideBar, Editor, expect, Explorer, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  // arrange
  await SideBar.hide()
  await SideBar.open('Explorer')
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/created.txt`
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.newFile()
  await Explorer.updateEditingValue('created.txt')
  await Explorer.acceptEdit()

  // assert
  const tab = Locator('.MainTab[title$="created.txt"]')
  const editorInput = Locator('.EditorInput textarea')
  await expect(tab).toBeVisible()
  // TODO
  await expect(editorInput).toBeFocused()

  for (const key of 'hello') {
    await KeyBoard.press(key)
  }
  await Editor.shouldHaveText('hello')

  await Main.save()
  await FileSystem.shouldHaveFile(filePath, 'hello')
}
