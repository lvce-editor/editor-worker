import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-replace-all'

export const test: Test = async ({ Command, Editor, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'alpha beta\nbeta gamma')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  await Editor.openFind()
  await Locator('.FindWidget .MultilineInputBox').type('beta')
  await Command.execute('FindWidget.toggleReplace')
  await Locator('.FindWidgetReplace .MultilineInputBox').type('delta')
  await Command.execute('FindWidget.replaceAll')

  await Editor.shouldHaveText('alpha delta\ndelta gamma')
}
