import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.diagnostics-delayed-single-preserves-scroll'

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/delayed-single-preserves-scroll.diagnostics-scroll`
  const content = Array.from({ length: 200 }, (_, index) => `é line ${index + 1}`).join('\n')
  await FileSystem.writeFile(uri, content)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.diagnostics-scroll-race'))
  await Settings.update({ 'editor.diagnostics': true })
  await Main.openUri(uri)
  await Command.execute('Editor.resize', { height: 120, width: 800, x: 0, y: 0 }, 10)
  for (let attempt = 0; attempt < 100; attempt++) {
    if (Number(await Command.executeExtensionCommand('diagnosticsScroll.pendingCount')) > 0) {
      break
    }
    if (attempt === 99) {
      throw new Error('Timed out waiting for diagnostics request')
    }
    await new Promise((resolve) => setTimeout(resolve, 10))
  }

  await Command.executeExtensionCommand('diagnosticsScroll.resolveSingle', 40)
  await new Promise((resolve) => setTimeout(resolve, 2))
  await Editor.setDeltaY(800)

  const diagnosticMarkers = Locator('.Editor .ScrollBarDiagnostic')
  for (let attempt = 0; attempt < 200; attempt++) {
    try {
      await expect(diagnosticMarkers).toHaveCount(1)
      break
    } catch (error) {
      if (attempt === 199) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
  }
  const firstRow = Locator('.EditorRow', { hasText: 'é line 1' })
  const expectedRow = Locator('.EditorRow', { hasText: 'é line 41' })
  await expect(firstRow).toBeHidden()
  await expect(expectedRow).toBeVisible()
}
