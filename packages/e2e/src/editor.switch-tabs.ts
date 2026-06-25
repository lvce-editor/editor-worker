import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-switch-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const shouldHaveActiveEditorText = async (expectedText: string): Promise<void> => {
    await expect(Locator('.EditorRows')).toHaveText(expectedText)
  }

  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const id = Date.now()
  const firstName = `switch-tabs-first-${id}.txt`
  const secondName = `switch-tabs-second-${id}.txt`
  const firstFile = `${tmpDir}/${firstName}`
  const secondFile = `${tmpDir}/${secondName}`
  await FileSystem.writeFile(firstFile, 'first file content')
  await FileSystem.writeFile(secondFile, 'second file content')
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()

  // act
  await Main.openUri(firstFile)

  // assert
  await expect(Locator(`.MainTab.MainTabSelected[title$="${firstName}"]`)).toBeVisible()
  await shouldHaveActiveEditorText('first file content')

  // act
  await Main.openUri(secondFile)

  // assert
  await expect(Locator(`.MainTab[title$="${firstName}"]`)).toBeVisible()
  await expect(Locator(`.MainTab.MainTabSelected[title$="${secondName}"]`)).toBeVisible()
  await shouldHaveActiveEditorText('second file content')

  // act
  await Main.selectTab(0, 0)

  // assert
  await expect(Locator(`.MainTab.MainTabSelected[title$="${firstName}"]`)).toBeVisible()
  await shouldHaveActiveEditorText('first file content')

  // act
  await Main.selectTab(0, 1)

  // assert
  await expect(Locator(`.MainTab.MainTabSelected[title$="${secondName}"]`)).toBeVisible()
  await shouldHaveActiveEditorText('second file content')
}
