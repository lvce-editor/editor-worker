import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.source-actions-execute'

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Main, Editor, Locator, expect, Extension }) => {
  // arrange
  const url = import.meta.resolve('../fixtures/editor.source-actions-execute').toString()
  await Extension.addWebExtension(url)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/src/test.xyz`, `import { add, subtract } from './add.xyz'`)
  await Main.openUri(`${tmpDir}/src/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.openSourceActions()

  // act
  await Command.execute('EditorSourceAction.selectItem', 'Organize Imports')

  // assert
  const sourceActions = Locator('.EditorSourceActions')
  await expect(sourceActions).toBeHidden()
  const token = Locator('.Token.Unknown')
  await expect(token).toHaveText(`import { add } from './add.xyz'`)
}
