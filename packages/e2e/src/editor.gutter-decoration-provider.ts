import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.gutter-decoration-provider'

export const test: Test = async ({ Command, expect, Extension, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.lineNumbers': false })
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/gutter-decoration-provider.txt`
  await FileSystem.writeFile(filePath, 'added\nmodified\ndeleted')
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.gutter-decoration-provider'))

  await Main.openUri(filePath)

  const gutter = Locator('.Gutter')
  const addedDecoration = Locator('.EditorGutterDecorationAdded')
  const modifiedDecoration = Locator('.EditorGutterDecorationModified')
  const deletedDecoration = Locator('.EditorGutterDecorationDeleted')
  await expect(gutter).toBeVisible()
  await expect(addedDecoration).toHaveCount(1)
  await expect(modifiedDecoration).toHaveCount(1)
  await expect(deletedDecoration).toHaveCount(1)

  await Command.execute('Editor.refreshGutterDecorationsAll')

  await expect(addedDecoration).toHaveCount(0)
  await expect(modifiedDecoration).toHaveCount(0)
  await expect(deletedDecoration).toHaveCount(0)
}
