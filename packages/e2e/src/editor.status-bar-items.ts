import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-status-bar-items'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/status-bar.js`, 'first\nsecond line')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/status-bar.js`)

  const position = Locator('.StatusBarItem[name="EditorPosition"]')
  const indentation = Locator('.StatusBarItem[name="EditorIndentation"]')
  const encoding = Locator('.StatusBarItem[name="EditorEncoding"]')
  const language = Locator('.StatusBarItem[name="EditorLanguage"]')
  const utf8Display = ['UTF', '8'].join('-')
  await expect(position).toHaveText('Ln 1, Col 1')
  await expect(indentation).toHaveText('Spaces: 4')
  await expect(encoding).toHaveText(utf8Display)
  await expect(language).toHaveText('javascript')

  await Editor.setCursor(1, 6)

  await expect(position).toHaveText('Ln 2, Col 7')
}
