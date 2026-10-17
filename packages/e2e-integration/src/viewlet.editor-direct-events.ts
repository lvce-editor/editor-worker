import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-direct-events'

export const test: Test = async ({ Editor, Extension, FileSystem, Main, Workspace }) => {
  await Extension.addWebExtension(import.meta.resolve('../fixtures/viewlet.editor-direct-events'))
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/input.direct-events`, '')
  await Workspace.setUri(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(`${tmpDir}/input.direct-events`)
  await Editor.shouldHaveText('')
}
