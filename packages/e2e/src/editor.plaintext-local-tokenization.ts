import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.plaintext-local-tokenization'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/plain.txt`
  const lines = Array.from({ length: 200 }, (_, index) => `plain line ${index}`)
  await FileSystem.writeFile(uri, lines.join('\n'))
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(150, lines[150].length)
  await Editor.type('é🙂')
  lines[150] += 'é🙂'
  await Editor.shouldHaveText(lines.join('\n'))
  const editedRow = Locator('.EditorRow', { hasText: lines[150] })
  await expect(editedRow).toBeVisible()
  await Command.execute('Editor.undo')
  lines[150] = 'plain line 150'
  await Editor.shouldHaveText(lines.join('\n'))
  await Command.execute('Editor.redo')
  lines[150] += 'é🙂'
  await Editor.shouldHaveText(lines.join('\n'))
  await Editor.setCursor(0, 0)
  const firstRow = Locator('.EditorRow', { hasText: 'plain line 0' })
  await expect(firstRow).toBeVisible()
  await Editor.setCursor(150, lines[150].length)
  await expect(editedRow).toBeVisible()
}
