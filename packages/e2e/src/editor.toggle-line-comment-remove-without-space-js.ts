import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-toggle-line-comment-remove-without-space-js'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.js`, '//const value = 1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.js`)
  await Editor.setCursor(0, 2)

  await Editor.toggleLineComment()

  await Editor.shouldHaveText('const value = 1')
}
