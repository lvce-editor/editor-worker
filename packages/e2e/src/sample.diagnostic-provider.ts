import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.diagnostic-provider'

export const skip = 1
export const test: Test = async ({ Editor, Settings, Main, Panel, FileSystem, Workspace, Extension, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `abcdefgh`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Settings.update({ 'editor.diagnostics': true })

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)

  // assert

  // @ts-ignore
  await Editor.shouldHaveDiagnostics([
    {
      rowIndex: 1,
      columnIndex: 1,
      endRowIndex: 1,
      endColumnIndex: 4,
      type: 'error',
      message: 'error',
    },
  ])

  // TODO verify diagnostics squiggles are visible

  // act
  // await Panel.open()

  // assert
  // const problems = Locator(`.Viewlet.Problems`)
  // await expect(problems).toBeVisible()
  // await expect(problems).toHaveText('No problems have been detected in the workspace.')
}
