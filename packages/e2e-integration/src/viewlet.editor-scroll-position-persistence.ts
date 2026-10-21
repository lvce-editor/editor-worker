import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-scroll-position-persistence'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const firstUri = `${tmpDir}/first.txt`
  const secondUri = `${tmpDir}/second.txt`
  const firstLines = Array.from({ length: 1000 }, (_, index) => `first line ${index}`)
  await FileSystem.writeFile(firstUri, firstLines.join('\n'))
  const secondLines = Array.from({ length: 1000 }, (_, index) => `second line ${index}`)
  await FileSystem.writeFile(secondUri, secondLines.join('\n'))
  await Workspace.setUri(tmpDir)
  await Main.closeAllEditors()

  await Main.openUri(firstUri)
  await Editor.setDeltaY(600 * 20)
  const visibleLine = Locator('.EditorRow', { hasText: 'first line 600' })
  await expect(visibleLine).toBeVisible()

  await Main.openUri(secondUri)
  await expect(Locator('.EditorRow', { hasText: 'second line 0', exact: true })).toBeVisible()
  await Editor.setDeltaY(300 * 20)
  const secondVisibleLine = Locator('.EditorRow', { hasText: 'second line 300', exact: true })
  await expect(secondVisibleLine).toBeVisible()
  await Main.openUri(firstUri)

  await expect(visibleLine).toBeVisible()

  // Dispose the editors, so reopening must hydrate saved state rather than
  // showing an existing worker instance. The cursor remains on the first line.
  await Main.closeAllEditors()
  await Main.openUri(firstUri)
  await expect(visibleLine).toBeVisible()
  await Main.openUri(secondUri)
  await expect(secondVisibleLine).toBeVisible()

  // Replacing the disposed first editor with another file must keep its offset.
  await Main.closeAllEditors()
  await Main.openUri(secondUri)
  await Main.openUri(firstUri)
  await expect(visibleLine).toBeVisible()

  await Main.closeAllEditors()
  await FileSystem.writeFile(firstUri, 'shortened file')
  await Main.openUri(firstUri)
  await expect(Locator('.EditorRow', { hasText: 'shortened file', exact: true })).toBeVisible()
}
