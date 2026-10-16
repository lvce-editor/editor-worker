import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.hover-disabled'

export const test: Test = async ({ Command, expect, Extension, FileSystem, Locator, Main, Settings }) => {
  await Settings.update({ 'editor.hover': false, 'editor.hoverDelay': 10 })
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.hover-show'))
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, 'globalThis.AbortSignal.abort()')
  await Main.openUri(`${tmpDir}/test.xyz`)

  const hover = Locator('.EditorHover')
  await Command.execute('Editor.handleMouseMove', 0, 0, false)
  await expect(hover).toBeHidden()
}
