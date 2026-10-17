import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-persistence'

export const test: Test = async ({ Command, Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const uri = `${tmpDir}/file1.txt`
  await FileSystem.writeFile(uri, 'content 1\ncontent 2\ncontent 3')
  await Workspace.setUri(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(uri)
  await Editor.setSelections(new Uint32Array([0, 0, 0, 0]))
  await Editor.openFindWidget()

  const findWidget = Locator('.FindWidget')
  const findWidgetInput = Locator('.FindWidget .MultilineInputBox')
  const findWidgetMatchCount = Locator('.FindWidgetMatchCount')
  await expect(findWidget).toBeVisible()
  await FindWidget.setValue('content')
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  const states: Record<string, { moduleId?: string; uid: number; uri?: string }> = await Command.execute('Viewlet.getAllStates')
  // Test workspaces intentionally suppress unload saves. Seed the normal
  // application once, then the sidecar uses the production save/reload path.
  for (const { moduleId, uid, uri } of Object.values(states)) {
    if (moduleId !== 'Editor' && moduleId !== 'Main') continue
    const storageId = moduleId === 'Editor' ? `Editor:${uri}` : moduleId
    await Command.execute('SaveState.saveViewletStateWithStorageId', uid, storageId)
  }
  await Command.execute('LocalStorage.setJson', 'reload-workspace', { homeDir: '', path: tmpDir, pathSeparator: '/', uri: tmpDir })
}
