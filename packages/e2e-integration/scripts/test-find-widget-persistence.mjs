import { expect } from '@playwright/test'

// Trigger the application's existing pre-unload save hint and wait for its
// asynchronous serializer before destroying the page's workers.
const save = async (page, expectedValue) => {
  await expect.poll(() => page.evaluate(() => window.__findWidgetSaveReady)).toBe(true)
  await page.evaluate(() => {
    const workspace = JSON.parse(sessionStorage.getItem('workspace'))
    localStorage.removeItem(`viewlet:${workspace.uri}:Editor:${workspace.uri}/file1.txt`)
    document.dispatchEvent(new Event('pointerleave'))
  })
  await expect
    .poll(() =>
      page.evaluate(() => {
        const workspace = JSON.parse(sessionStorage.getItem('workspace'))
        const key = `viewlet:${workspace.uri}:Editor:${workspace.uri}/file1.txt`
        const saved = localStorage.getItem(key)
        if (saved === null) return 'not-saved'
        const { editorState } = JSON.parse(saved)
        return editorState?.widgets?.[0]?.state?.value ?? null
      }),
    )
    .toBe(expectedValue)
}

export const test = async ({ page }) => {
  // The editor is visible before Workbench registers its save hint. Observe
  // registration on every real navigation/reload without changing app startup.
  await page.addInitScript(() => {
    const addEventListener = document.addEventListener
    document.addEventListener = function (type, ...args) {
      const result = addEventListener.call(this, type, ...args)
      if (type === 'pointerleave') {
        window.__findWidgetSaveReady = true
        document.addEventListener = addEventListener
      }
      return result
    }
  })
  const findWidget = page.locator('.FindWidget')
  const findWidgetInput = page.locator('.FindWidget .MultilineInputBox')
  const findWidgetMatchCount = page.locator('.FindWidgetMatchCount')

  await expect(findWidgetInput).toHaveValue('content')
  await page.evaluate(() => sessionStorage.setItem('workspace', localStorage.getItem('reload-workspace')))
  // Leave the test document so its setup cannot reopen Find after reload.
  await page.goto(new URL('/index.html', page.url()).href)
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  await save(page, 'content')
  await page.reload()
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')
  await expect(findWidgetMatchCount).toHaveText('1 of 3')
  await expect(page.locator('.Hover')).toBeHidden()

  await findWidgetInput.fill('')
  await expect(findWidgetMatchCount).toHaveText('No Results')
  await save(page, '')
  await page.reload()
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('')

  await findWidgetInput.press('Escape')
  await expect(findWidget).toBeHidden()
  await save(page, null)
  await page.reload()
  await expect(page.locator('.Editor')).toBeVisible()
  await expect(findWidget).toBeHidden()
}
