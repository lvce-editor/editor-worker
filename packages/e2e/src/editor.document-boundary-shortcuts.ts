import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.document-boundary-shortcuts'

export const test: Test = async ({ Editor, FileSystem, KeyBoard, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'first\nmiddle\nlast')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 3)

  await KeyBoard.press('Control+End')
  await Editor.type('X')
  await Editor.shouldHaveText('first\nmiddle\nlastX')

  await KeyBoard.press('Control+Home')
  await Editor.type('Y')
  await Editor.shouldHaveText('Yfirst\nmiddle\nlastX')
}
