import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-bracket-matching-highlight'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '() {} [] value')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  const bracketMatches = Locator('.BracketMatch')

  for (const columnIndex of [0, 3, 6]) {
    await Editor.setCursor(0, columnIndex)
    await expect(bracketMatches).toHaveCount(2)
  }

  await Editor.setCursor(0, 10)
  await expect(bracketMatches).toHaveCount(0)
}
