import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.source-actions-execute'

export const test: Test = async ({ FileSystem, Main, Editor, Locator, expect, Extension }) => {
  // arrange
  const url = new URL('../fixtures/editor.source-actions-execute', import.meta.url).toString()
  await Extension.addWebExtension(url)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/src/test.xyz`, 'globalThis.AbortSignal.abort()')
  await Main.openUri(`${tmpDir}/src/test.xyz`)
  await Editor.setCursor(0, 11)

  // act
  await Editor.openSourceActions()

  // assert
  const sourceActionItems = Locator('.SourceActionItem')
  await expect(sourceActionItems).toHaveCount(1)
  const organizeImports = Locator('.SourceActionItem', { hasText: 'Organize Imports' })
  await expect(organizeImports).toBeVisible()
}
