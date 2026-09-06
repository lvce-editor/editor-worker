import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.diagnostic-provider-update-on-type'

export const test: Test = async ({ Command, Editor, Extension, FileSystem, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, 'retu')
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(import.meta.resolve(`../fixtures/${name}`))
  await Settings.update({ 'editor.diagnostics': true })
  await Main.openUri(`${tmpDir}/test.xyz`)

  const assertSnapshot = async (text: string): Promise<void> => {
    await Editor.shouldHaveText(text)
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        // @ts-ignore
        await Editor.shouldHaveDiagnostics([
          {
            columnIndex: 0,
            endColumnIndex: 1,
            endRowIndex: 0,
            message: JSON.stringify(text),
            rowIndex: 0,
            type: 'error',
          },
        ])
        return
      } catch (error) {
        if (attempt === 99) {
          throw error
        }
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
    }
  }

  await assertSnapshot('retu')
  await Editor.setCursor(0, 4)
  await Editor.type('rn')
  await assertSnapshot('return')
  await Editor.setCursor(0, 6)
  await Editor.type('\nconst value = "é😀"')
  await assertSnapshot('return\nconst value = "é😀"')
  await Command.execute('Editor.undo')
  await assertSnapshot('return')
  await Command.execute('Editor.redo')
  await assertSnapshot('return\nconst value = "é😀"')
}
