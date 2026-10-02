import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.unnecessary-diagnostic'

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, 'abcdefgh')
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(import.meta.resolve(`../fixtures/${name}`))
  await Settings.update({ 'editor.diagnostics': true })
  await Main.openUri(`${tmpDir}/test.xyz`)

  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      // @ts-ignore diagnostic tags are not yet part of the e2e assertion type
      await Editor.shouldHaveDiagnostics([
        {
          columnIndex: 1,
          endColumnIndex: 4,
          endRowIndex: 0,
          message: 'unused variable',
          rowIndex: 0,
          // @ts-ignore diagnostic tags are not yet part of the e2e assertion type
          tags: [1],
          type: 'warning',
        },
      ])
      break
    } catch (error) {
      if (attempt === 99) throw error
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
  }

  const unnecessaryToken = Locator('.EditorTokenUnnecessary')
  await expect(unnecessaryToken).toHaveText('bcd')
}
