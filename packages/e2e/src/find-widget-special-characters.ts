import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-special-characters'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `const x = (a + b) * c;
const result = fn(x);
a.b.c.d`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFind()

  // act - search for special regex characters (should be escaped in non-regex mode)
  await FindWidget.setValue('(a + b)')

  // assert - should find literal match, not treat as regex
  const findWidgetMatchCount = Locator(`.FindWidgetMatchCount`)
  await expect(findWidgetMatchCount).toBeVisible()
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - search for dots (special in regex)
  await FindWidget.setValue('a.b.c')

  // assert - should find literal dots, not any character
  await expect(findWidgetMatchCount).toHaveText('1 of 1')

  // act - search for asterisk
  await FindWidget.setValue('*')

  // assert - should find literal asterisk
  await expect(findWidgetMatchCount).toHaveText('1 of 1')
}
