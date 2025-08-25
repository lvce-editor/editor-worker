import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.source-actions-open'

export const test: Test = async ({ FileSystem, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/src/test.xyz`, 'globalThis.AbortSignal.abort()')
  await Main.openUri(`${tmpDir}/src/test.xyz`)
  await Editor.setCursor(0, 11)

  // act
  await Editor.openSourceActions()

  // assert
  const organizeImports = Locator('.SourceActionItem', { hasText: 'Organize Imports' })
  await expect(organizeImports).toBeVisible()
}
