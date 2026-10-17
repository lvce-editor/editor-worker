import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.completion-pending-does-not-block-editing'

const expectUnblocked = async (operation: Promise<void>, name: string): Promise<void> => {
  const waitForOperation = async (): Promise<true> => {
    await operation
    return true
  }
  const completed = await Promise.race([waitForOperation(), new Promise<false>((resolve) => setTimeout(resolve, 1000, false))])
  if (!completed) {
    throw new Error(`${name} was blocked by pending completion results`)
  }
}

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.completion-pending'))
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.xyz`
  await FileSystem.writeFile(uri, 'first line\nsecond line')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, 0)

  const pendingOpen = Editor.openCompletion()
  const completesQuickly = async (): Promise<boolean> => {
    let completed = false
    const waitForCompletion = async (): Promise<void> => {
      await pendingOpen
      completed = true
    }
    await Promise.race([waitForCompletion(), new Promise<void>((resolve) => setTimeout(resolve, 100))])
    return completed
  }
  if (await completesQuickly()) {
    throw new Error('Completion request resolved before the delayed provider returned')
  }

  await expectUnblocked(Editor.type('x'), 'Typing')
  await expectUnblocked(Editor.cursorDown(), 'Cursor movement')
  await expectUnblocked(Editor.type('y'), 'Typing during a pending request')
  await Editor.shouldHaveText('xfirst line\nsyecond line')

  await pendingOpen
  const completions = Locator('.EditorCompletion')
  await expect(completions).toBeHidden()
  await Editor.shouldHaveText('xfirst line\nsyecond line')
  await Editor.shouldHaveSelections(new Uint32Array([1, 2, 1, 2]))

  const openCompletion = Editor.openCompletion()
  await openCompletion
  await expect(completions).toBeVisible()
}
