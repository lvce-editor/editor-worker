import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-type-multiline'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'before after')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setCursor(0, 7)

  await Editor.type('one\ntwo\n')

  await Editor.shouldHaveText('before one\ntwo\nafter')
}
