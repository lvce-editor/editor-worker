import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-extensionless-shebang-syntax-highlighting'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/acorn`
  await FileSystem.writeFile(filePath, '#!/usr/bin/env node\nconst value = 1')
  await Workspace.setUri(tmpDir)

  await Main.openUri(filePath)

  await expect(Locator('.Token.Keyword')).toHaveText('const')
  await expect(Locator('.Token.Numeric')).toHaveText('1')
}
