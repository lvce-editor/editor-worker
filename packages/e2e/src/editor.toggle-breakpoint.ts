import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-toggle-breakpoint'

export const test: Test = async ({ Command, Editor, expect, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.js`, 'const value = 1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file.js`)
  await Editor.setCursor(0, 6)

  await Command.execute('Editor.toggleBreakpoint')

  const breakpoint = Locator('.LineNumberBreakpoint')
  await expect(breakpoint).toBeVisible()
  await expect(breakpoint).toHaveAttribute('title', 'Breakpoint on line 1')

  await KeyBoard.press('F9')

  await expect(breakpoint).toBeHidden()
}
