import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-breadcrumbs-disabled'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.ts`
  await FileSystem.writeFile(uri, 'const value = 1')
  await Settings.update({
    'breadcrumbs.enabled': false,
  })
  await Workspace.setUri(tmpDir)
  await Main.openUri(uri)

  await expect(Locator('.EditorBreadcrumbs')).toHaveCount(0)
  await expect(Locator('.EditorBreadcrumb')).toHaveCount(0)
  await expect(Locator('.EditorBreadcrumbSeparator')).toHaveCount(0)
}
