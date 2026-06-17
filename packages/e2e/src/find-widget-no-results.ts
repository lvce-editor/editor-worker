import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-no-results'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'alpha beta')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  await Editor.openFindWidget()
  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  await findWidgetInput.type('missing')

  const findWidgetMatchCount = Locator('.FindWidgetMatchCount')
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('No Results')
}
