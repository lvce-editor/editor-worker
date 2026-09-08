import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.document-boundary-shortcuts'

export const test: Test = async ({ Editor, expect, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'first\nmiddle\n')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)
  const editorInput = Locator('.EditorInput textarea')
  const cursor = Locator('.EditorCursor')
  await expect(editorInput).toBeFocused()
  await expect(cursor).toHaveCSS('translate', '0px')

  await KeyBoard.press('Control+End')
  await expect(cursor).toHaveCSS('translate', '0px 40px')
  await Editor.shouldHaveSelections(new Uint32Array([2, 0, 2, 0]))
  await Editor.type('X')
  await Editor.shouldHaveText('first\nmiddle\nX')

  await KeyBoard.press('Control+Home')
  await expect(cursor).toHaveCSS('translate', '0px')
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.type('Y')
  await Editor.shouldHaveText('Yfirst\nmiddle\nX')
}
