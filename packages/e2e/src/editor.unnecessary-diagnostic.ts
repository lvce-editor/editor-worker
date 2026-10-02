import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.unnecessary-diagnostic'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, 'abcdefgh')
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(import.meta.resolve(`../fixtures/${name}`))
  await Settings.update({ 'editor.diagnostics': true })
  await Main.openUri(`${tmpDir}/test.xyz`)

  const unnecessaryToken = Locator('.EditorTokenUnnecessary')
  await expect(unnecessaryToken).toHaveText('bcd')
}
