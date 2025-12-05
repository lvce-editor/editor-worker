import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = true

export const name = 'sample.diagnostic-provider-empty'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Panel, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `abcdefgh`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Main.openUri(`${tmpDir}/test.xyz`)

  // act
  // @ts-ignore
  await Panel.open()

  // assert
  const problems = Locator(`.Viewlet.Problems`)
  await expect(problems).toBeVisible()
  await expect(problems).toHaveText('No problems have been detected in the workspace.')
}
