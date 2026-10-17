import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.line-end-cursor-after-typing'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const text = '\t👩‍💻é'
  await FileSystem.writeFile(`${tmpDir}/line-end.txt`, text)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/line-end.txt`)
  await Editor.cursorEnd()
  await Editor.shouldHaveSelections(new Uint32Array([0, text.length, 0, text.length]))
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toBeVisible()

  await Editor.type('x')
  await Editor.shouldHaveText(`${text}x`)
  await Editor.shouldHaveSelections(new Uint32Array([0, text.length + 1, 0, text.length + 1]))
  await Editor.cursorCharacterLeft()
  await Editor.shouldHaveSelections(new Uint32Array([0, text.length, 0, text.length]))
  await Editor.cursorCharacterRight()
  await Editor.shouldHaveSelections(new Uint32Array([0, text.length + 1, 0, text.length + 1]))
  await expect(cursor).toBeVisible()
}
