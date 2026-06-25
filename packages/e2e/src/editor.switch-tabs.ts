import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-switch-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const shouldHaveActiveEditorText = async (expectedText: string): Promise<void> => {
    const editorRows = Locator('.EditorRows')
    await expect(editorRows).toHaveText(expectedText)
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
  const firstTab = Locator(`.MainTab[title$="${firstName}"]`)
  const selectedFirstTab = Locator(`.MainTab.MainTabSelected[title$="${firstName}"]`)
  await expect(selectedFirstTab).toBeVisible()
  await shouldHaveActiveEditorText('first file content')

  // act
  await Main.openUri(secondFile)

  // assert
  const selectedSecondTab = Locator(`.MainTab.MainTabSelected[title$="${secondName}"]`)
  await expect(firstTab).toBeVisible()
  await expect(selectedSecondTab).toBeVisible()
  await shouldHaveActiveEditorText('second file content')

  // act
  await Main.selectTab(0, 0)

  // assert
  await expect(selectedFirstTab).toBeVisible()
  await shouldHaveActiveEditorText('first file content')

  // act
  await Main.selectTab(0, 1)

  // assert
  await expect(selectedSecondTab).toBeVisible()
  await shouldHaveActiveEditorText('second file content')
}
