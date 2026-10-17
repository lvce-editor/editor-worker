import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.syntax-highlighting-yaml'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const yamlPath = `${tmpDir}/workflow.yml`
  const yamlContent = `jobs:
  release:
    steps:
      - name: release
        shell: bash
        run: |
          echo "RG_VERSION=\${GITHUB_REF#refs/tags/}" >> $GITHUB_ENV
          echo "version is: \${{ env.RG_VERSION }}"
      - name: next step
        id: next
        run: echo done`

  await FileSystem.writeFile(yamlPath, yamlContent)
  await Workspace.setPath(tmpDir)
  await Main.openUri(yamlPath)

  await Editor.setCursor(9, 0)
  const propertyToken = Locator('.Token.YamlPropertyName', { hasText: 'jobs' })
  await expect(propertyToken).toBeVisible()
  const shellVariableToken = Locator('.Token.VariableName', { hasText: '$GITHUB_ENV' })
  await expect(shellVariableToken).toBeVisible()
  const shellStringToken = Locator('.Token.String', { hasText: 'RG_VERSION=${GITHUB_REF#refs/tags/}' })
  await expect(shellStringToken).toBeVisible()
  const followingYamlProperty = Locator('.Token.YamlPropertyName', { hasText: 'id' })
  await expect(followingYamlProperty).toBeVisible()
}
