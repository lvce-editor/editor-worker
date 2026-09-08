import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.pixel-scroll-wrapper'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.lineNumbers': true })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/pixel-scroll.txt`
  await FileSystem.writeFile(uri, Array.from({ length: 100 }, (_, index) => `line ${index + 1}`).join('\n'))
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Command.execute('Editor.resize', { height: 60, width: 800, x: 0, y: 0 }, 10)

  const layers = Locator('.EditorLayers')
  const gutterRows = Locator('.GutterRows')
  const rows = Locator('.EditorRow')
  const rowContainer = Locator('.EditorRows')
  const lineNumbers = Locator('.Gutter .LineNumber')
  await expect(rows.first()).toHaveCSS('height', '20px')
  await expect(rowContainer).toHaveCSS('flex-direction', 'column')
  await expect(rows.first()).toHaveCSS('contain', 'size style')
  await expect(layers).toHaveCSS('translate', 'none')
  await expect(rows).toHaveCount(3)

  await Editor.setDeltaY(7)
  await expect(layers).toHaveCSS('translate', '0px -7px')
  await expect(gutterRows).toHaveCSS('translate', '0px -7px')
  await expect(rows.first()).toHaveCSS('translate', 'none')
  await expect(rows).toHaveCount(4)
  await expect(lineNumbers).toHaveCount(4)

  await Editor.setDeltaY(13)
  await expect(layers).toHaveCSS('translate', 'none')
  await expect(gutterRows).toHaveCSS('translate', 'none')
  await expect(rows.first()).toHaveText('line 2')
  await expect(rows).toHaveCount(3)

  await Editor.setDeltaY(-20)
  await expect(layers).toHaveCSS('translate', 'none')
  await expect(rows.first()).toHaveText('line 1')

  await Editor.setDeltaY(7)
  await Command.execute('Editor.handlePointerDown', 0, false, false, 31, 55, 1, 30)
  await Command.execute('Editor.handleMouseDown', 0, false, false, 31, 55, 1)
  await Editor.shouldHaveSelections(new Uint32Array([3, 0, 3, 0]))
}
