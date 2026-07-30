import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.hover-show'

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, Locator, Main, Settings }) => {
  // arrange
  await Settings.update({ 'editor.hover': true })
  const url = import.meta.resolve('../fixtures/editor.hover-show')
  await Extension.addWebExtension(url)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/src/test.xyz`, 'globalThis.AbortSignal.abort()')
  await Main.openUri(`${tmpDir}/src/test.xyz`)
  await Editor.setCursor(0, 11)

  // act
  await Command.execute('Editor.showHover2')

  // assert
  const hover = Locator('.EditorHover')
  await expect(hover).toBeVisible()
  await expect(hover).toHaveText('def')

  // act
  await Main.closeAllEditors()

  // assert
  await expect(hover).toBeHidden()
}
