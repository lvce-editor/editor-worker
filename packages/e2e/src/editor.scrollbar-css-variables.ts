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
  const horizontalThumb = Locator('.ScrollBarThumbHorizontal[style]')
  // Attribute and CSS matchers in this test driver do not apply negation.
  const translatedHorizontalThumb = Locator(
    '.ScrollBarThumbHorizontal[style*="translate:"]:not([style*="translate: 0px"]):not([style*="translate:0px"])',
  )

  await expect(verticalThumb).toBeVisible()
  await expect(horizontalThumb).toBeVisible()
  await expect(horizontalThumb).toHaveCSS('translate', '0px')
  await expect(verticalThumb).toHaveAttribute('style', null)

  await Command.execute('Editor.handleWheel', 0, 100, 0)
  await expect(translatedHorizontalThumb).toBeVisible()
  await Command.execute('Editor.handleWheel', 0, -100_000, 0)
  await expect(translatedHorizontalThumb).toHaveCount(0)
  await expect(horizontalThumb).toHaveCSS('translate', '0px')
}
