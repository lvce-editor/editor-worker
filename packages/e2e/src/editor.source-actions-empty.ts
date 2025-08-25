import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.source-actions-empty'

export const test: Test = async ({ FileSystem, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/src/test.xyz`, 'globalThis.AbortSignal.abort()')
  await Main.openUri(`${tmpDir}/src/test.xyz`)
  await Editor.setCursor(0, 11)

  // act
  await Editor.openSourceActions()

  // assert
  const emptyMessage = Locator('.EditorMessageText')
  await expect(emptyMessage).toHaveText('No code actions available')
}
