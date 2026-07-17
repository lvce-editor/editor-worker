import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-add-below-shortcut'

export const test: Test = async ({ Editor, FileSystem, KeyBoard, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `alpha\nbeta\ngamma`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 3)

  await KeyBoard.press('Control+Alt+ArrowDown')
  await Editor.type('X')

  await Editor.shouldHaveText(`alpXha\nbetXa\ngamma`)
}
