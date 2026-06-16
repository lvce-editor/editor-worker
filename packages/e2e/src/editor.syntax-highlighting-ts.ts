import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-ts'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const tsPath = `${tmpDir}/main.ts`
  const tsContent = `const userName: string = 'Ada'
export { userName }`

  await FileSystem.writeFile(tsPath, tsContent)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(tsPath)

  // assert
  const typeToken = Locator('.Token.TypePrimitive', { hasText: 'string' })
  await expect(typeToken).toBeVisible()
}
