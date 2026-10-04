import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.hover-show'

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, Locator, Main, Settings }) => {
  let stage = 'setup'
  try {
    // arrange
    await Settings.update({ 'editor.hover': true, 'editor.hoverDelay': 10 })
    const url = import.meta.resolve('../fixtures/editor.hover-show')
    await Extension.addWebExtension(url)
    const tmpDir = await FileSystem.getTmpDir()
    await FileSystem.writeFile(`${tmpDir}/src/test.xyz`, 'globalThis.AbortSignal.abort()')
    await Main.openUri(`${tmpDir}/src/test.xyz`)
    stage = 'initial mouse hover'
    const hover = Locator('.EditorHover')

    // act
    await Command.execute('Editor.handleMouseMove', 0, 0, false)

    // assert
    await expect(hover).toHaveText('first\n')

    // act
    await Command.execute('Editor.handleMouseMove', 1000, 10, false)

    // assert
    await expect(hover).toBeVisible()

    // act
    stage = 'keyboard hover'
    await Command.execute('Editor.handleMouseMove', 0, 0, true)
    await Editor.setCursor(0, 11)
    await Command.execute('Editor.showHover', { columnIndex: 11, rowIndex: 0 })

    // assert
    await expect(hover).toHaveText('def\n')

    // act
    stage = 'close editors'
    await Main.closeAllEditors()

    // assert
    await expect(hover).toBeHidden()

    // act
    stage = 'open empty hover editor'
    const emptyUri = `${tmpDir}/src/empty.xyz`
    await FileSystem.writeFile(emptyUri, 'globalThis.AbortSignal.abort()')
    await Main.openUri(emptyUri)
    await Command.execute('Editor.handleMouseMove', 0, 0, false)

    // assert
    await expect(hover).toBeHidden()

    // arrange
    stage = 'open fit-content editor'
    const hoverFitContentUri = `${tmpDir}/src/hover-fit-content.xyz`
    await FileSystem.writeFile(hoverFitContentUri, 'globalThis.AbortSignal.abort()')
    await Main.openUri(hoverFitContentUri)
    stage = 'fit-content keyboard hover'

    // act
    await Editor.setCursor(0, 11)
    await Command.execute('Editor.showHover', { columnIndex: 11, rowIndex: 0 })

    // assert
    await expect(hover).toContainText('OrbitControls<THREE.PerspectiveCamera>')
    await expect(hover).toHaveCSS('height', '98px')
    await expect(hover).toHaveJSProperty('clientHeight', 96)
    await expect(hover).toHaveJSProperty('scrollHeight', 96)
  } catch (error) {
    throw new Error(`Hover stage ${stage}: ${error instanceof Error ? error.stack : error}`)
  }
}
