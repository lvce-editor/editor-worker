import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget-font-size'
// This DOM regression is enabled in the lvce-editor consumer after its CSS change lands.
export const skip = 1

export const test: Test = async ({ Command, Editor, expect, FileSystem, FindWidget, Locator, Main, Settings, Workspace }) => {
  try {
    const tmpDir = await FileSystem.getTmpDir()
    const filePath = `${tmpDir}/find-widget-font-size.txt`
    await FileSystem.writeFile(filePath, 'content')
    await Workspace.setPath(tmpDir)
    await Main.openUri(filePath)

    await Settings.update({ 'editor.findWidgetFontSize': 30 })
    const fontSize = await Command.execute('Preferences.get', 'editor.findWidgetFontSize')
    if (fontSize !== 30) {
      throw new Error(`unexpected font size ${fontSize}`)
    }
    await Editor.openFindWidget()
    const findWidget = Locator('.FindWidget')
    await expect(findWidget).toHaveCSS('height', '45px')

    await FindWidget.toggleReplace()
    await expect(findWidget).toHaveCSS('height', '45px')

    await Settings.update({ 'editor.findWidgetFontSize': 50 })
    await Command.execute('Editor.handleSettingsChanged')
    await expect(findWidget).toHaveCSS('height', '65px')

    await Settings.update({ 'editor.findWidgetFontSize': 0 })
    await Command.execute('Editor.handleSettingsChanged')
    await expect(findWidget).toHaveCSS('height', '30px')
  } finally {
    await Settings.update({ 'editor.findWidgetFontSize': 0 })
    await Command.execute('Editor.handleSettingsChanged')
  }
}
