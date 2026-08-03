import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-auto-save-after-delay'

const waitForAutoSave = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1200))
}

export const test: Test = async ({ Command, Editor, FileSystem, Main, Settings, Workspace }) => {
  await Settings.update({ 'files.autoSave': 'afterDelay' })
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/auto-save-after-delay.txt`
  await FileSystem.writeFile(filePath, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Editor.setCursor(0, 3)

  await Editor.type('d')
  await waitForAutoSave()
  await FileSystem.shouldHaveFile(filePath, 'abcd')

  await Command.execute('Editor.undo')
  await waitForAutoSave()
  await FileSystem.shouldHaveFile(filePath, 'abc')

  await Settings.update({ 'files.autoSave': 'off' })
}
