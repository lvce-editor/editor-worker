import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-font-size'

export const test: Test = async ({ Command, Editor, expect, FileSystem, FindWidget, Locator, Main, Settings, Workspace }) => {
  try {
    const tmpDir = await FileSystem.getTmpDir()
    const filePath = `${tmpDir}/find-widget-font-size.txt`
    await FileSystem.writeFile(filePath, 'content')
    await Workspace.setPath(tmpDir)
    await Main.openUri(filePath)

    await Settings.update({ 'editor.findWidgetFontSize': 30 })
    await Editor.openFindWidget()
    const findInput = Locator('.FindWidget .SearchFieldInput')
    await expect(findInput).toHaveCSS('font-size', '30px')
    await expect(findInput).toHaveCSS('height', '40px')

    await FindWidget.toggleReplace()
    const replaceInput = Locator('.FindWidget .FindWidgetReplace .MultilineInputBox')
    await expect(replaceInput).toHaveCSS('font-size', '30px')
    await expect(replaceInput).toHaveCSS('height', '40px')

    await Settings.update({ 'editor.findWidgetFontSize': 50 })
    await Command.execute('Editor.handleSettingsChanged')
    await expect(findInput).toHaveCSS('font-size', '50px')
    await expect(replaceInput).toHaveCSS('height', '60px')

    await Settings.update({ 'editor.findWidgetFontSize': 0 })
    await Command.execute('Editor.handleSettingsChanged')
    await expect(findInput).toHaveCSS('font-size', '13px')
  } finally {
    await Settings.update({ 'editor.findWidgetFontSize': 0 })
    await Command.execute('Editor.handleSettingsChanged')
  }
}
