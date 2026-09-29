import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.hover-markdown'

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main }) => {
  const url = import.meta.resolve('../fixtures/editor.hover-markdown')
  await Extension.addWebExtension(url)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/src/test.xyz`, 'globalThis.AbortSignal.abort()')
  await Main.openUri(`${tmpDir}/src/test.xyz`)
  await Editor.setCursor(0, 11)
  await Editor.openHover()

  const hover = Locator('.EditorHover')
  const link = hover.locator('.HoverDocumentation a')
  const code = hover.locator('.HoverDocumentation pre code')
  await expect(hover).toBeVisible()
  await expect(hover.locator('.HoverDisplayString')).toHaveText('signature')
  await expect(link).toHaveText('API guide')
  await expect(link).toHaveAttribute('href', 'https://example.com/api')
  await expect(code).toHaveText('const answer = 42\nconsole.log(answer)\n')
  await expect(hover.locator('.HoverDocumentation')).toHaveText('Read the API guide.\nconst answer = 42\nconsole.log(answer)\n\n')
}
