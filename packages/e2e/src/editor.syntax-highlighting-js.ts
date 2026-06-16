import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-js'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const jsPath = `${tmpDir}/main.js`
  const jsContent = `const answer = 42
console.log(answer)`

  await FileSystem.writeFile(jsPath, jsContent)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(jsPath)

  // assert
  const keywordToken = Locator('.Token.Keyword', { hasText: 'const' })
  await expect(keywordToken).toBeVisible()
}
