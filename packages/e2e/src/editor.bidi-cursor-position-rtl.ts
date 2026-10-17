import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-bidi-cursor-position-rtl'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'אבג')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  await Editor.setCursor(0, 0)

  const row = Locator('.EditorRow').first()
  await expect(row).toHaveCSS('direction', 'rtl')
}
