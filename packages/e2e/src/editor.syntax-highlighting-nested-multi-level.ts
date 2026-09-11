import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-nested-multi-level'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/editor.syntax-highlighting-edge-cases')
  await Extension.addWebExtension(extensionUri)
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/multi.shnestedmulti`
  const content = `<middle>
<inner>
alpha
reset
after`

  await FileSystem.writeFile(filePath, content)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(filePath)

  // assert
  const outerTag = Locator('.Token.EdgeNestedOuterTag', { hasText: '<middle>' })
  await expect(outerTag).toBeVisible()
  const middleTag = Locator('.Token.EdgeNestedMiddleTag', { hasText: '<inner>' })
  await expect(middleTag).toBeVisible()
  const innerToken = Locator('.Token.EdgeNestedInner', { hasText: 'alpha' })
  await expect(innerToken).toBeVisible()
  const resetToken = Locator('.Token.EdgeNestedOuterText', { hasText: 'reset' })
  await expect(resetToken).toBeVisible()
  const afterToken = Locator('.Token.EdgeNestedOuterText', { hasText: 'after' })
  await expect(afterToken).toBeVisible()
}
