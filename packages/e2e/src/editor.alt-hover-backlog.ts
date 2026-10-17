import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.alt-hover-backlog'

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, Locator, Main }) => {
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.alt-hover-backlog'))
  const root = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${root}/main.backlog`, 'target\nother\nlast')
  await Main.openUri(`${root}/main.backlog`)
  const first = Command.execute('Editor.handleMouseMove', 0, 0, true)
  await Command.executeExtensionCommand('altHoverBacklog.waitForStart')
  const rest = Array.from({ length: 9 }, (_, index) => Command.execute('Editor.handleMouseMove', 0, index === 8 ? 0 : 25, true))
  await Command.executeExtensionCommand('altHoverBacklog.release')
  await Promise.all([first, ...rest])
  const offsets = (await Command.executeExtensionCommand('altHoverBacklog.offsets')) as number[]
  if (offsets.length === 0 || offsets.length > 2 || offsets.at(-1) !== 0) {
    throw new Error(`Expected at most active and newest Alt-hover requests, got ${JSON.stringify(offsets)}`)
  }
  const definitionLink = Locator('.Token.EditorGoToDefinitionLink')
  await expect(definitionLink).toHaveText('target')
  await Command.execute('Editor.handleMouseMove', 0, 0, false)
  await expect(definitionLink).toBeHidden()
  await Editor.setCursor(0, 0)
  await Editor.type('edited ')
  await Editor.shouldHaveText('edited target\nother\nlast')
}
