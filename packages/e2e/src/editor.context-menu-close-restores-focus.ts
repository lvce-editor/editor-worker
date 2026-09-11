import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.context-menu-close-restores-focus'

export const test: Test = async ({ Editor, expect, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/file1.txt`
  await FileSystem.writeFile(filePath, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 3]))

  const editorInput = Locator('.EditorInput textarea')
  const editor = Locator('.Editor')
  await expect(editorInput).toBeFocused()

  // act
  await editor.click({ button: 'right' })

  // assert
  const contextMenu = Locator('#ContextMenu')
  await expect(contextMenu).toBeVisible()

  // act
  await KeyBoard.press('Escape')

  // assert
  await expect(contextMenu).toBeHidden()
  await expect(editorInput).toBeFocused()
}
