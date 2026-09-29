import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.scrollbar-css-variables'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/scrollbars.txt`
  const longLine = 'x'.repeat(500)
  const content = Array.from({ length: 200 }, (_, index) => `${index} ${longLine}`).join('\n')

  await FileSystem.writeFile(filePath, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.resize', { height: 800, width: 400, x: 0, y: 0 }, 10)

  const verticalThumb = Locator('.ScrollBarThumbVertical')
  const horizontalThumb = Locator('.ScrollBarThumbHorizontal')

  await expect(verticalThumb).toBeVisible()
  await expect(horizontalThumb).toHaveCount(0)
  await expect(verticalThumb).toHaveAttribute('style', null)
}
