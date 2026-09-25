import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.close-reopen-file'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/close-reopen.txt`
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()

  const editorRows = Locator('.EditorRows')
  for (let cycle = 0; cycle < 3; cycle++) {
    const content = `revision ${cycle}`
    await FileSystem.writeFile(uri, content)
    await Main.openUri(uri)
    await expect(editorRows).toHaveText(content)
    await Editor.setCursor(0, content.length)
    await Editor.type(' saved')
    await Main.save()
    await FileSystem.shouldHaveFile(uri, `${content} saved`)
    await Main.closeAllEditors()
    await expect(editorRows).toBeHidden()
    await Main.openUri(uri)
    await expect(editorRows).toHaveText(`${content} saved`)
    await Main.closeAllEditors()
  }
}
