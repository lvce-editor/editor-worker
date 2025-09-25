import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.diagnostic-provider'

export const skip = 1

export const test: Test = async ({ Settings, Main, Panel, FileSystem, Workspace, Extension, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `abcdefgh`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Settings.update({ 'Editor.diagnosticsEnabled': true })

  await Main.openUri(`${tmpDir}/test.xyz`)

  // TODO verify diagnostics squiggles are visible

  // act
  // await Panel.open()

  // assert
  // const problems = Locator(`.Viewlet.Problems`)
  // await expect(problems).toBeVisible()
  // await expect(problems).toHaveText('No problems have been detected in the workspace.')
}
