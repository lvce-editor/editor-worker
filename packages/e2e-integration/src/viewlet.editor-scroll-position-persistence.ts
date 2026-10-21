import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-scroll-position-persistence'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const firstUri = `${tmpDir}/first.txt`
  const secondUri = `${tmpDir}/second.txt`
  const firstLines = Array.from({ length: 1000 }, (_, index) => `first line ${index}`)
  await FileSystem.writeFile(firstUri, firstLines.join('\n'))
  await FileSystem.writeFile(secondUri, 'second file')
  await Workspace.setUri(tmpDir)
  await Main.closeAllEditors()

  await Main.openUri(firstUri)
  await Editor.setDeltaY(600 * 20)
  const visibleLine = Locator('.EditorRow', { hasText: 'first line 600' })
  await expect(visibleLine).toBeVisible()

  await Main.openUri(secondUri)
  await Main.openUri(firstUri)

  await expect(visibleLine).toBeVisible()
}
