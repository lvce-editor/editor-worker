import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.link-detection-markdown'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const url = 'https://github.com/lvce-editor/lvce-editor'
  const testContent = `[Lvce Editor](${url}).`

  await FileSystem.writeFile(`${tmpDir}/test-links.md`, testContent)
  await Main.openUri(`${tmpDir}/test-links.md`)

  // assert
  const linkToken = Locator('.Token.Link')

  await expect(linkToken).toBeVisible()
  await expect(linkToken).toHaveText(url)
}
