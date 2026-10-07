import { expect } from '@playwright/test'

export const test = async ({ page }) => {
  await page.locator('#TestOverlay').evaluate((element) => element.remove())
  const row = page.locator('.EditorRow').first()
  const geometry = () =>
    page.evaluate(() => {
      const element = document.querySelector('.EditorRow')
      let offset = element.textContent.indexOf('0014')
      if (offset < 0) return undefined
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
      let node
      while (walker.nextNode()) {
        node = walker.currentNode
        if (offset < node.length) break
        offset -= node.length
      }
      const range = document.createRange()
      range.setStart(node, offset)
      range.setEnd(node, offset + 4)
      const text = range.getBoundingClientRect()
      const diagnostic = document.querySelector('.DiagnosticError').getBoundingClientRect()
      const cursor = document.querySelector('.EditorCursor').getBoundingClientRect()
      return {
        cursor: cursor.x + cursor.width / 2,
        diagnostic: diagnostic.x,
        diagnosticWidth: diagnostic.width,
        text: text.x,
        textWidth: text.width,
      }
    })
  const checkAlignment = async () => {
    await expect
      .poll(async () => {
        const value = await geometry()
        return (
          !!value &&
          Math.abs(value.text - value.cursor) < 1 &&
          Math.abs(value.text - value.diagnostic) < 1 &&
          Math.abs(value.textWidth - value.diagnosticWidth) < 1
        )
      })
      .toBe(true)
  }
  await checkAlignment()
  await page.mouse.move(400, 90)
  await page.mouse.wheel(400.5, 0)
  await expect(row).not.toContainText('0000')
  await checkAlignment()
  const before = await geometry()
  await page.mouse.wheel(0.5, 0)
  await expect
    .poll(async () => {
      const value = await geometry()
      return !!value && Math.abs(before.text - value.text - 0.5) < 0.05
    })
    .toBe(true)
  await checkAlignment()
  await page.mouse.wheel(-401, 0)
  await expect(row).toContainText('0000')
  await checkAlignment()
}
