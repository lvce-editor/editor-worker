import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.hover-show'

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, Locator, Main, Settings }) => {
  // arrange
  await Settings.update({ 'editor.hover': true, 'editor.hoverDelay': 10 })
  const url = import.meta.resolve('../fixtures/editor.hover-show')
  await Extension.addWebExtension(url)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/src/test.xyz`, 'globalThis.AbortSignal.abort()')
  await Main.openUri(`${tmpDir}/src/test.xyz`)
  const hover = Locator('.EditorHover')

  // act
  await Command.execute('Editor.handleMouseMove', 0, 0, false)

  // assert
  await expect(hover).toHaveText('first')

  // act
  await Command.execute('Editor.handleMouseMove', 1000, 10, false)

  // assert
  await expect(hover).toBeVisible()

  // act
  await Command.execute('Editor.handleMouseMove', 0, 0, true)
  await Editor.setCursor(0, 11)
  await Command.execute('Editor.showHover', { columnIndex: 11, rowIndex: 0 })

  // assert
  await expect(hover).toHaveText('def')

  // act
  await Main.closeAllEditors()

  // assert
  await expect(hover).toBeHidden()
}
