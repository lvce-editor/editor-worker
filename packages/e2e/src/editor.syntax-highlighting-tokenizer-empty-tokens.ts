import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-tokenizer-empty-tokens'

// TODO enable when empty tokenizer output falls back to visible text instead of rendering an empty line.
export const skip = 1

export const test: Test = async ({ Editor, Extension, FileSystem, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-edge-cases')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/empty.shemptytokens`
  await FileSystem.writeFile(filePath, 'empty tokens')
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(filePath)

  // assert
  await Editor.shouldHaveText('empty tokens')
}
