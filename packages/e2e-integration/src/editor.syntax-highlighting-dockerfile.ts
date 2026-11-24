import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-dockerfile'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/Dockerfile`
  await FileSystem.writeFile(filePath, 'FROM alpine\n# Install dependencies\nRUN echo ready')
  await Workspace.setUri(tmpDir)

  await Main.openUri(filePath)

  await expect(Locator('.Token.Keyword', { hasText: 'FROM ' })).toBeVisible()
  await expect(Locator('.Token.Keyword', { hasText: 'RUN ' })).toBeVisible()
  await expect(Locator('.Token.Comment', { hasText: ' Install dependencies' })).toBeVisible()
}
