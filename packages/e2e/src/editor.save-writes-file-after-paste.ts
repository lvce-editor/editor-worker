import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-save-writes-file-after-paste'

export const test: Test = async ({ Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/file1.txt`
  await FileSystem.writeFile(filePath, 'start end')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Editor.setCursor(0, 6)
  await Command.execute('Editor.pasteText', 'middle ')

  await Main.save()

  await FileSystem.shouldHaveFile(filePath, 'start middle end')
}
