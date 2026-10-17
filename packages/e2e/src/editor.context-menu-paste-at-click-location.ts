import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.context-menu-paste-at-click-location'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'first line\nsecond line\nfinal line')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(1, 7)

  await Command.execute('Editor.handleMouseDown', 2, false, false, 0, 100, 1)
  await Command.execute('Editor.pasteText', 'CTX')

  await Editor.shouldHaveText('first line\nsecond line\nCTXfinal line')
}
