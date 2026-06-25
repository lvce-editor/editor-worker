import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.scrollbar-css-variables'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/scrollbars.txt`
  const longLine = 'x'.repeat(500)
  const content = Array.from({ length: 200 }, (_, index) => `${index} ${longLine}`).join('\n')

  await FileSystem.writeFile(filePath, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  const verticalThumb = Locator('.ScrollBarThumbVertical')
  const horizontalThumb = Locator('.ScrollBarThumbHorizontal')

  await expect(verticalThumb).toBeVisible()
  await expect(horizontalThumb).toBeVisible()
  await expect(verticalThumb).toHaveAttribute('style', null)
  await expect(horizontalThumb).toHaveAttribute('style', null)
}
