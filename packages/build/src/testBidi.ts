import assert from 'node:assert/strict'
import { fork } from 'node:child_process'
import { once } from 'node:events'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { root } from './root.ts'

const port = 3013
const server = fork(join(root, 'packages/server/src/server.js'), [], {
  env: { ...process.env, ONLY_EXTENSION: join(root, 'packages/e2e'), PORT: String(port), TEST_PATH: join(root, 'packages/e2e') },
  stdio: ['ignore', 'inherit', 'inherit', 'ipc'],
})
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined
try {
  await Promise.race([
    once(server, 'message'),
    (async (): Promise<never> => {
      await once(server, 'exit')
      throw new Error('Bidi test server exited before readiness')
    })(),
  ])
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  page.setDefaultTimeout(10_000)
  page.on('pageerror', (error) => process.stderr.write(`${error.stack}\n`))
  page.on('console', (message) => {
    if (message.type() === 'error') process.stderr.write(message.text() + '\n')
  })
  await page.goto(`http://localhost:${port}/tests/_all.html?filter=editor.bidi-interaction`)
  await page.locator('.TestResults').waitFor({ state: 'attached' })
  const results = JSON.parse((await page.locator('.TestResults').textContent()) || '[]')
  assert.equal(results.length, 1)
  assert.equal(results[0].status, 'pass', results[0].error)
  await page.locator('#TestOverlay').evaluate((element) => element.remove())

  // Use DOM Range geometry as an independent oracle, including tokens that
  // split an RTL run across several text nodes.
  const nativePosition = async (row: number, run: number, offset: number) =>
    page
      .locator('.EditorRow')
      .nth(row)
      .locator('.EditorBidiRun')
      .nth(run)
      .evaluate((element, offset) => {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
        let node: Node | null
        while ((node = walker.nextNode())) {
          const length = node.textContent!.length
          if (offset <= length) {
            const range = document.createRange()
            range.setStart(node, offset)
            range.collapse(true)
            const rect = range.getBoundingClientRect()
            return { x: rect.x, y: element.getBoundingClientRect().y + 8 }
          }
          offset -= length
        }
        throw new Error('Missing text boundary')
      }, offset)
  const checkCursor = async (row: number, run: number, offset: number) => {
    const expected = await nativePosition(row, run, offset)
    await page
      .waitForFunction(({ x, y }) => {
        const rect = document.querySelector('.EditorCursor')?.getBoundingClientRect()
        return rect && Math.abs(rect.x + rect.width / 2 - x) < 1.5 && Math.abs(rect.y + 8 - y) < 1.5
      }, expected)
      .catch(async (error) => {
        process.stderr.write(
          JSON.stringify({
            row,
            run,
            offset,
            expected,
            actual: await page.evaluate(() => ({
              cursor: document.querySelector('.EditorCursor')?.outerHTML,
              status: [...document.querySelectorAll('.StatusBarItem')].map((element) => element.textContent),
              active: document.activeElement?.tagName,
            })),
          }) + '\n',
        )
        throw error
      })
  }

  await checkCursor(0, 1, 0)
  await page.locator('textarea[name=editor]').focus()
  await page.keyboard.press('ArrowLeft')
  await checkCursor(0, 1, 1)
  await page.keyboard.press('Shift+ArrowLeft')
  await checkCursor(0, 1, 2)
  const from = await nativePosition(0, 1, 1)
  const to = await nativePosition(0, 1, 2)
  await page.waitForFunction(
    ({ from, to }) => {
      const rect = document.querySelector('.EditorSelection')?.getBoundingClientRect()
      return rect && Math.abs(rect.width - Math.abs(to.x - from.x)) < 1.5 && Math.abs(rect.x - Math.min(from.x, to.x)) < 1.5
    },
    { from, to },
  )

  for (const [row, run, offset] of [
    [0, 1, 1],
    [2, 1, 1],
    [3, 1, 0],
  ]) {
    const point = await nativePosition(row, run, offset)
    await page.mouse.click(point.x, point.y)
    await checkCursor(row, run, offset)
  }
  // Click an Arabic run with embedded numbers, and preserve its visual edge.
  for (const offset of [0, 1, 2, 3, 4]) {
    const arabic = await nativePosition(1, 2, offset)
    await page.mouse.click(arabic.x - 0.2, arabic.y)
    await checkCursor(1, 2, offset)
  }
  const longRow = await page.locator('.EditorRow').nth(4).boundingBox()
  assert.ok(longRow)
  await page.mouse.move(200, longRow.y + 8)
  await page.mouse.wheel(100_000, 0)
  await page.waitForFunction(() => document.querySelectorAll('.EditorRow')[4].getBoundingClientRect().x < 0)
  const scrolled = await nativePosition(4, 1, 1)
  await page.mouse.click(scrolled.x, scrolled.y)
  await checkCursor(4, 1, 1)

  await page.screenshot({ path: join(root, '.tmp/bidi-interaction.png') })
  process.stdout.write('Bidi caret, selection, tokenized text, tabs, and native mouse regression passed\n')
} finally {
  await browser?.close()
  if (server.exitCode === null) {
    const exited = once(server, 'exit')
    server.kill()
    await exited
  }
}
