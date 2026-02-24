import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.context-menu-source-action'

export const test: Test = async ({ ContextMenu, Editor, expect, Extension, FileSystem, Locator, Main }) => {
  // arrange
  const url = import.meta.resolve('../fixtures/editor.source-actions-open').toString()
  await Extension.addWebExtension(url)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/src/test.xyz`, 'globalThis.AbortSignal.abort()')
  await Main.openUri(`${tmpDir}/src/test.xyz`)

  // act
  await Editor.openEditorContextMenu()
  await ContextMenu.selectItem('Source Action')

  // assert
  const sourceActionItems = Locator('.SourceActionItem')
  await expect(sourceActionItems).toHaveCount(1)
}
