import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.language'

export const skip = true

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, 'test')
  await Workspace.setUri(tmpDir)
  await Extension.addWebExtension(new URL('../fixtures/sample.language', import.meta.url).href)

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)

  // assert
  const token = Locator('.Token')
  await expect(token).toHaveClass('Xyz')
}
