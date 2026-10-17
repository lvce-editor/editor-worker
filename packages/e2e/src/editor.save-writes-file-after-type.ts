import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-save-writes-file-after-type'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/file1.txt`
  await FileSystem.writeFile(filePath, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Editor.setCursor(0, 3)
  await Editor.type('def')

  await Main.save()

  await FileSystem.shouldHaveFile(filePath, 'abcdef')
}
