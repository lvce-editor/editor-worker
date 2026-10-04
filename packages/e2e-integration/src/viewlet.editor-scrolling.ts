import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-scrolling'

export const skip = true

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.xyz`,
    `{
  "annotations": {
    "list": [
      {
        "a": 1,
        "b": 2,
        "c": 3,
        "d": 4,
        "e": 5,
        "f": 6,
        "g": 7,
        "h": 8,
        "i": 9
      },
      {
        "a": 1,
        "b": 2,
        "c": 3,
        "d": 4,
        "e": 5,
        "f": 6,
        "g": 7,
        "h": 8,
        "i": 9
      }
    ]
  },
  "description": "",
  "editable": true
}
` + '\n'.repeat(50),
  )
  await Workspace.setUri(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).href)
  await Main.openUri(`${tmpDir}/file1.xyz`)

  // assert
  const descriptionToken = Locator('.Token', { hasText: 'description' })
  await expect(descriptionToken).toHaveClass('JsonPropertyName')

  // act
  await Editor.setDeltaY(40)

  // assert
  await expect(descriptionToken).toHaveClass('JsonPropertyName')
}
