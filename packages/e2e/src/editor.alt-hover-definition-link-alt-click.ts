import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.alt-hover-definition-link-alt-click'

export const test: Test = async ({ Command, Editor, Extension, FileSystem, Main }) => {
  // arrange
  const extensionUrl = import.meta.resolve('../fixtures/editor.alt-hover-definition-link')
  await Extension.addWebExtension(extensionUrl)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.dlt`, 'target\ndefinition')
  await Main.openUri(`${tmpDir}/test.dlt`)
  await Command.execute('Editor.handleMouseMove', 0, 0, true)

  // act
  await Command.execute('Editor.handleMouseDown', 0, true, false, 0, 0, 1)

  // assert
  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0]))
}
