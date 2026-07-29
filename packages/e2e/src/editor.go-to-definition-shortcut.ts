import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.go-to-definition-shortcut'

export const test: Test = async ({ Editor, Extension, FileSystem, KeyBoard, Main }) => {
  const extensionUrl = import.meta.resolve('../fixtures/editor.alt-hover-definition-link')
  await Extension.addWebExtension(extensionUrl)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.dlt`, 'target\ndefinition')
  await Main.openUri(`${tmpDir}/test.dlt`)
  await Editor.setCursor(0, 2)

  await KeyBoard.press('F12')
  await new Promise((resolve) => setTimeout(resolve, 100))

  await Editor.shouldHaveSelections(new Uint32Array([1, 0, 1, 0]))
}
