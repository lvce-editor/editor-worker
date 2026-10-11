import { expect } from '@playwright/test'

// Trigger the application's existing pre-unload save hint and wait for its
// asynchronous serializer before destroying the page's workers.
const save = async (page, expectedValue) => {
  await page.evaluate(() => document.dispatchEvent(new Event('pointerleave')))
  await expect
    .poll(() =>
      page.evaluate(() => {
        const workspace = JSON.parse(sessionStorage.getItem('workspace'))
        const key = `viewlet:${workspace.uri}:Editor:${workspace.uri}/file1.txt`
        const { editorState } = JSON.parse(localStorage.getItem(key)) ?? {}
        return editorState?.widgets?.[0]?.state?.value ?? null
      }),
    )
    .toBe(expectedValue)
}

export const test = async ({ page }) => {
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
