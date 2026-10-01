import assert from 'node:assert/strict'
import { fork } from 'node:child_process'
import { once } from 'node:events'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { root } from './root.ts'

const port = 3011
const server = fork(join(root, 'packages/server/src/server.js'), [], {
  env: {
    ...process.env,
    ONLY_EXTENSION: join(root, 'packages/e2e'),
    PORT: String(port),
    TEST_PATH: join(root, 'packages/e2e'),
  },
  stdio: ['ignore', 'inherit', 'inherit', 'ipc'],
})
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined
try {
  await Promise.race([
    once(server, 'message'),
    once(server, 'exit').then(() => {
      throw new Error('Hover pointer test server exited before readiness')
    }),
  ])
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  page.setDefaultTimeout(10_000)
  const prepare = async (): Promise<void> => {
    await page.goto(`http://localhost:${port}/tests/_all.html?filter=editor.hover-dismissal`)
    await page.locator('.TestResults').waitFor({ state: 'attached' })
    const results = JSON.parse((await page.locator('.TestResults').textContent()) || '[]')
    assert.equal(results.length, 1)
    assert.equal(results[0].status, 'pass', results[0].error)
    await page.locator('#TestOverlay').evaluate((element) => element.remove())
    await page.locator('.EditorHover').waitFor({ state: 'visible' })
  }

  await prepare()
  await page.locator('.EditorHover').hover()
  await page.waitForTimeout(750)
  assert.equal(await page.locator('.EditorHover').isVisible(), true)
  await page.locator('.TitleBar').hover()
  await page.locator('.EditorHover').waitFor({ state: 'hidden' })

  await prepare()
  await page.locator('.Editor').hover({ position: { x: 10, y: 100 } })
  await page.locator('.TitleBar').hover()
  await page.locator('.Editor').hover({ position: { x: 10, y: 100 } })
  await page.waitForTimeout(750)
  assert.equal(await page.locator('.EditorHover').isVisible(), true)
  await page.locator('.TitleBar').hover()
  await page.locator('.EditorHover').waitFor({ state: 'hidden' })
  process.stdout.write('Native pointer hover dismissal and re-entry passed\n')
} finally {
  await browser?.close()
  if (server.exitCode === null) {
    const exited = once(server, 'exit')
    server.kill()
    await exited
  }
}
