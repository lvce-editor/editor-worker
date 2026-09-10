import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.gutter-large-line-numbers'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.lineNumbers': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/large-line-numbers.txt`
  await FileSystem.writeFile(uri, Array.from({ length: 10_010 }, (_, index) => `line ${index + 1}`).join('\n'))
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Command.execute('Editor.resize', { height: 60, width: 800, x: 0, y: 0 }, 10)

  const lineNumbers = Locator('.Gutter .LineNumber')
  const secondLineNumber = lineNumbers.nth(1)
  for (const rowIndex of [998, 9998]) {
    await Editor.setDeltaY(rowIndex * 20)
    await expect(lineNumbers.first()).toHaveText(String(rowIndex + 1))
    await expect(secondLineNumber).toHaveText(String(rowIndex + 2))
    await expect(secondLineNumber).toHaveCSS('contain', 'content')
    await Editor.setDeltaY(-rowIndex * 20)
  }
}
