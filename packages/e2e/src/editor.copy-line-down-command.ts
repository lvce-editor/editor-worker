import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-copy-line-down-command'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'one\ntwo')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 3)

  await Editor.copyLineDown()

  await Editor.shouldHaveText('one\none\ntwo')
  await Editor.shouldHaveSelections(new Uint32Array([1, 3, 1, 3]))

  await Editor.setCursor(2, 3)
  await Editor.copyLineDown()

  await Editor.shouldHaveText('one\none\ntwo\ntwo')
  await Editor.shouldHaveSelections(new Uint32Array([3, 3, 3, 3]))

  const longContent = Array.from({ length: 100 }, (_, index) => `line ${index + 1}`).join('\n')
  await FileSystem.writeFile(`${tmpDir}/long-file.txt`, longContent)
  await Main.openUri(`${tmpDir}/long-file.txt`)
  await Editor.setCursor(99, 7)

  await Editor.copyLineDown()

  await Editor.shouldHaveSelections(new Uint32Array([100, 7, 100, 7]))
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toBeVisible()
}
