import { expect } from '@playwright/test'

export const test = async ({ page }) => {
  await page.goto(new URL('/', page.url()).toString())

  const findWidget = page.locator('.FindWidget')
  const findWidgetInput = page.locator('.FindWidget .MultilineInputBox')
  const findWidgetMatchCount = page.locator('.FindWidgetMatchCount')

  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  await page.reload()
  await expect(findWidgetInput).toBeVisible()
  await expect(findWidgetInput).toHaveValue('content')
  await expect(findWidgetMatchCount).toHaveText('1 of 3')

  await findWidgetInput.fill('')
  await expect(findWidgetInput).toHaveValue('')
  await page.reload()
  await expect(findWidget).toBeVisible()
  await expect(findWidgetInput).toHaveValue('')

  await findWidgetInput.press('Escape')
  await expect(findWidget).toBeHidden()
  await page.reload()
  await expect(findWidget).toBeHidden()
}
