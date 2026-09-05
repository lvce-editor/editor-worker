import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-multi-cursor-add-below-shortcut'

export const test: Test = async ({ Editor, expect, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `alpha\nbeta\ngamma`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 3)
  await expect(Locator('.EditorInput textarea')).toBeFocused()

  await KeyBoard.press('Control+Alt+ArrowDown')
  await expect(Locator('.EditorCursor')).toHaveCount(2)
  await Editor.shouldHaveSelections(new Uint32Array([0, 3, 0, 3, 1, 3, 1, 3]))
  await Editor.type('X')

  await Editor.shouldHaveText(`alpXha\nbetXa\ngamma`)
}
