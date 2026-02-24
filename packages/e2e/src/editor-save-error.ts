import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-file-error'

export const skip = 1

export const test: Test = async ({ Editor, expect, Extension, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/write-file-error')
  await Extension.addWebExtension(extensionUri)
  const prefix = 'extension-host://xyz://'
  await Workspace.setPath(prefix)
  const errorFile = `${prefix}/test.txt`
  await Main.openUri(errorFile)
  const tab = Locator('.MainTab[title$="test.txt"]')
  await expect(tab).toBeVisible()
  await Editor.shouldHaveText('Hello World')

  // act
  await Main.save()

  // assert

  // TODO should probably show a notification or modal with the error message
}
