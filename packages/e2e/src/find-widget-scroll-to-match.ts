import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-scroll-to-match'

export const test: Test = async ({ Command, Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const lines = Array.from({ length: 300 }, (_, index) => `line ${index}`)
  lines[100] = 'needle first'
  lines[200] = 'needle second'
  await FileSystem.writeFile(`${tmpDir}/matches.txt`, lines.join('\n'))
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/matches.txt`)
  await Command.execute('Editor.resize', { height: 100, width: 800, x: 0, y: 0 }, 10)
  await Editor.openFind()

  const firstMatch = Locator('.EditorRow', { hasText: 'needle first' })
  const secondMatch = Locator('.EditorRow', { hasText: 'needle second' })
  await expect(firstMatch).toHaveCount(0)
  await expect(secondMatch).toHaveCount(0)

  await Locator('.FindWidget .MultilineInputBox').type('needle')
  await expect(firstMatch).toBeVisible()
  await Editor.shouldHaveSelections(new Uint32Array([100, 0, 100, 6]))
  await expect(Locator('.EditorRow').nth(2)).toHaveText('needle first')

  await FindWidget.focusNext()
  await expect(secondMatch).toBeVisible()
  await Editor.shouldHaveSelections(new Uint32Array([200, 0, 200, 6]))
  await expect(Locator('.EditorRow').nth(2)).toHaveText('needle second')
  await expect(firstMatch).toHaveCount(0)

  await FindWidget.focusPrevious()
  await expect(firstMatch).toBeVisible()
  await Editor.shouldHaveSelections(new Uint32Array([100, 0, 100, 6]))
  await expect(Locator('.EditorRow').nth(2)).toHaveText('needle first')
  await expect(secondMatch).toHaveCount(0)
}
