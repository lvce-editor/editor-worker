import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-replace-keeps-widget-visible'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'foo bar')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.openFind()
  await FindWidget.setValue('foo')
  await FindWidget.toggleReplace()
  await FindWidget.setReplaceValue('baz')

  const findWidget = Locator('.FindWidget')
  const replaceSection = Locator('.FindWidget .FindWidgetReplace')
  await expect(findWidget).toBeVisible()
  await expect(replaceSection).toBeVisible()

  // act
  await FindWidget.replace()

  // assert
  await Editor.shouldHaveText('baz bar')
  await expect(findWidget).toBeVisible()
  await expect(replaceSection).toBeVisible()
}
