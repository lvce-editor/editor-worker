import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.source-actions-execute'

export const test: Test = async ({ Command, FileSystem, Main, Editor, Locator, expect, Extension }) => {
  // arrange
  const url = import.meta.resolve('../fixtures/editor.source-actions-execute').toString()
  await Extension.addWebExtension(url)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/src/test.xyz`, `import { add, subtract } from './add.xyz'`)
  await Main.openUri(`${tmpDir}/src/test.xyz`)
  await Editor.openSourceActions()

  // act

  // assert
  // const sourceActionItems = Locator('.SourceActionItem')
  // await expect(sourceActionItems).toHaveCount(1)
  // const organizeImports = Locator('.SourceActionItem', { hasText: 'Organize Imports' })
  // await expect(organizeImports).toBeVisible()

  // act
  // await Command.execute('Editor.organizeImports')

  // assert
  // await Editor.shouldHaveText(`import { add } from './add.xyz'`)
}
