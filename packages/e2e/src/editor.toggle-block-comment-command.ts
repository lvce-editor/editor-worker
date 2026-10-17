import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-toggle-block-comment-command'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.js`, 'const value = 1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file.js`)
  await Editor.setCursor(0, 6)

  await Command.execute('Editor.toggleBlockComment')

  await Editor.shouldHaveText('/*const value = 1*/')
}
