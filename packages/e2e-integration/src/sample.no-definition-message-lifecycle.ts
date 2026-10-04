import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.no-definition-message-lifecycle'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/test.css`
  await FileSystem.writeFile(filePath, 'missing-selector { color: unknown-color; }')
  await Workspace.setUri(tmpDir)
  await Main.openUri(filePath)
  await Editor.setCursor(0, 0)

  await Editor.goToDefinition()

  const message = Locator('.EditorOverlayMessage')
  await expect(message).toBeVisible()
  await expect(message).toHaveText("No definition found for 'missing-selector'")
  await new Promise((resolve) => setTimeout(resolve, 2500))
  await expect(message).toBeVisible()
  await expect(message).toBeHidden()

  await Settings.update({ 'editor.messageDelay': 500 })
  await Editor.goToDefinition()
  await expect(message).toBeVisible()
  await new Promise((resolve) => setTimeout(resolve, 250))
  await expect(message).toBeVisible()
  await expect(message).toBeHidden()
}
