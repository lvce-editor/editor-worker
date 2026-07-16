import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-rapid-before-input'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'baseline')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 8)

  await Promise.all([
    Command.execute('Editor.handleBeforeInput', 'insertText', 'a'),
    Command.execute('Editor.handleBeforeInput', 'insertText', 'b'),
    Command.execute('Editor.handleBeforeInput', 'insertText', 'c'),
  ])

  await Editor.shouldHaveText('baselineabc')
}
