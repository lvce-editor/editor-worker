import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.gutter-pointer-cursor-placement'

export const test: Test = async ({ Command, Editor, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.lineNumbers': true })
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/gutter-pointer-cursor-placement.txt`
  await FileSystem.writeFile(filePath, 'alpha bravo charlie')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  const editorRow = Locator('.EditorRow').first()
  await Command.execute('PointerCapture.mock')
  await editorRow.dispatchEvent('pointerdown', {
    altKey: false,
    bubbles: true,
    button: 0,
    clientX: 31,
    clientY: 1,
    ctrlKey: false,
    detail: 1,
    pointerId: 1,
  } as any)
  await editorRow.dispatchEvent('mousedown', {
    altKey: false,
    bubbles: true,
    button: 0,
    clientX: 31,
    clientY: 1,
    ctrlKey: false,
    detail: 1,
  } as any)
  await Command.execute('PointerCapture.unmock')

  await Editor.shouldHaveSelections(new Uint32Array([0, 0, 0, 0]))
}
