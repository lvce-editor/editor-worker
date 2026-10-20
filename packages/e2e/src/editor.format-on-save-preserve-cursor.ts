import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.format-on-save-preserve-cursor'

export const test: Test = async ({ Editor, Extension, FileSystem, Main, Settings }) => {
  await Settings.update({ 'editor.formatActions': 'post-save', 'editor.formatOnSave': true })
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.format-on-save'))
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.format-test`, '  {\n    "name": "example",\n  "version": "1.0.0"\n  }\n')
  await Main.openUri(`${tmpDir}/file.format-test`)
  await Editor.setCursor(2, 4)
  await Editor.type('x')
  const savePromise = Main.save()
  const waitForContents = async (expected: string): Promise<void> => {
    for (let attempt = 0; attempt < 1000; attempt++) {
      const contents = await FileSystem.readFile(`${tmpDir}/file.format-test`)
      if (contents === expected) {
        return
      }
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
    throw new Error(`Timed out waiting for file contents: ${expected}`)
  }
  await waitForContents('  {\n    "name": "example",\n  "vxersion": "1.0.0"\n  }\n')
  await savePromise
  await waitForContents('{\n  "name": "example",\n  "vxersion": "1.0.0"\n}\n')
  await Editor.shouldHaveText('{\n  "name": "example",\n  "vxersion": "1.0.0"\n}\n')
  await Editor.shouldHaveSelections(new Uint32Array([2, 5, 2, 5]))
  await Main.save()
  await Editor.shouldHaveSelections(new Uint32Array([2, 5, 2, 5]))
  await Editor.format()
  await Editor.shouldHaveSelections(new Uint32Array([2, 5, 2, 5]))
}
