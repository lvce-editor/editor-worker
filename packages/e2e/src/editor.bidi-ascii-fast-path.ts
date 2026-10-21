import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-bidi-ascii-fast-path'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.rtl': true })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'const value = 123;')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 0)
  await Editor.cursorCharacterRight()
  await Editor.shouldHaveSelections(new Uint32Array([0, 1, 0, 1]))

  const bidiRuns = Locator('.EditorBidiRun')
  await expect(bidiRuns).toHaveCount(0)
}
