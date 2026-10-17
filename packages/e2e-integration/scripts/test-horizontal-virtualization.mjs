import { expect } from '@playwright/test'

export const test = async ({ page }) => {
  await page.locator('#TestOverlay').evaluate((element) => element.remove())
  const row = page.locator('.EditorRow').first()
  const track = page.locator('.ScrollBarHorizontal')
  const thumb = page.locator('.ScrollBarThumbHorizontal')
  await expect(row).toContainText('0000')
  const drag = async (end) => {
    const trackBounds = await track.boundingBox()
    const thumbBounds = await thumb.boundingBox()
    if (!trackBounds || !thumbBounds) throw new Error('Horizontal scrollbar must be visible')
    const y = thumbBounds.y + thumbBounds.height / 2
    await page.mouse.move(thumbBounds.x + thumbBounds.width / 2, y)
    await page.mouse.down()
    await page.mouse.move(end ? trackBounds.x + trackBounds.width - thumbBounds.width / 2 : trackBounds.x + thumbBounds.width / 2, y, { steps: 5 })
    await page.mouse.up()
  }
  await drag(true)
  await expect(row).toContainText('0999!')
  await expect(row).not.toContainText('0000')
  const previousTrackWidth = (await track.boundingBox()).width
  await page.setViewportSize({ width: 800, height: 600 })
  // The browser resizes the track before the worker's new thumb CSS arrives.
  // Wait for the complete rendered layout before targeting the thumb.
  await expect
    .poll(async () => {
      const bounds = await track.boundingBox()
      const slider = await thumb.boundingBox()
      return !!bounds && !!slider && bounds.width < previousTrackWidth && slider.x + slider.width <= bounds.x + bounds.width + 1
    })
    .toBe(true)
  await drag(false)
  await expect(row).toContainText('0000')
  await expect(row).not.toContainText('0999!')
  await drag(true)
  await expect(row).toContainText('0999!')
  const visibleEnd = await row.evaluate((element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    let last
    for (let node = walker.nextNode(); node; node = walker.nextNode()) last = node
    if (!last) throw new Error('Expected visible editor text')
    const range = document.createRange()
    range.setStart(last, Math.max(0, last.textContent.length - 6))
    range.setEnd(last, last.textContent.length)
    return { end: range.getBoundingClientRect().right, viewportEnd: element.closest('.EditorContent').getBoundingClientRect().right }
  })
  expect(visibleEnd.end).toBeLessThanOrEqual(visibleEnd.viewportEnd + 1)
}
