import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.toggle-block-comment-yaml'

export const test: Test = async ({ Command, Editor, Extension, FileSystem, Main, Workspace }) => {
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.toggle-block-comment-yaml'))
  const tmpDir = await FileSystem.getTmpDir()
  const original = 'steps:\n  run: test\n  env: production'
  await FileSystem.writeFile(`${tmpDir}/test.yaml`, original)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/test.yaml`)
  await Editor.setSelections(new Uint32Array([1, 0, 2, 17]))

  await Command.execute('Editor.toggleBlockComment')
  await Editor.shouldHaveText('steps:\n  # run: test\n  # env: production')

  await Command.execute('Editor.toggleBlockComment')
  await Editor.shouldHaveText(original)
}
