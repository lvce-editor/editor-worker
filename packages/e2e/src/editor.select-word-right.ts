import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-select-word-right'

export const test: Test = async ({ Command, Editor, expect, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `foo bar\nbaz`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)
  await Command.execute('Editor.handleFocus')
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 0]))
  const editorInput = Locator('.EditorInput textarea')
  await expect(editorInput).toBeFocused()
  const position = Locator('.StatusBarItem[name="EditorPosition"]')

  await KeyBoard.press('Control+Shift+ArrowRight')
  await expect(position).toHaveText('Ln 1, Col 4 (3 selected)')
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 3]))
  await KeyBoard.press('Control+Shift+ArrowRight')
  await expect(position).toHaveText('Ln 1, Col 8 (7 selected)')
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 7]))
  await KeyBoard.press('Control+Shift+ArrowRight')
  await expect(position).toHaveText('Ln 2, Col 1 (8 selected)')
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 1, 0]))
  await KeyBoard.press('Control+Shift+ArrowRight')
  await expect(position).toHaveText('Ln 2, Col 4 (11 selected)')
  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 1, 3]))
  for (let i = 0; i < 6; i++) {
    await KeyBoard.press('Control+Shift+ArrowRight')
    await expect(position).toHaveText('Ln 2, Col 4 (11 selected)')
    await Editor.shouldHaveSelections(new Uint32Array([0, 0, 1, 3]))
  }
}
