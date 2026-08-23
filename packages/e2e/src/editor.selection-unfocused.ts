import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.selection-unfocused'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/selection-unfocused.txt`
  await FileSystem.writeFile(filePath, 'selected text')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 8]))

  const selection = Locator('.EditorSelection')
  await expect(selection).toHaveClass('EditorSelection')

  await Editor.openFind()

  await expect(selection).toHaveClass('EditorSelection SelectionUnfocused')
  await FindWidget.close()
  await expect(selection).toHaveClass('EditorSelection')
}
