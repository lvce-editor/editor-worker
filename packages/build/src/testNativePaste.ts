import assert from 'node:assert/strict'
import { fork } from 'node:child_process'
import { once } from 'node:events'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { root } from './root.ts'

const port = 3012
const server = fork(join(root, 'packages/server/src/server.js'), [], {
  env: { ...process.env, ONLY_EXTENSION: join(root, 'packages/e2e'), PORT: String(port), TEST_PATH: join(root, 'packages/e2e') },
  stdio: ['ignore', 'inherit', 'inherit', 'ipc'],
})
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined
try {
  await Promise.race([
    once(server, 'message'),
    (async () => {
      await once(server, 'exit')
      throw new Error('Paste test server exited before readiness')
    })(),
  ])
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  page.setDefaultTimeout(10_000)
  await page.goto(`http://localhost:${port}/tests/_all.html?filter=editor.paste-text-single-line`)
  await page.locator('.TestResults').waitFor({ state: 'attached' })
  const results = JSON.parse((await page.locator('.TestResults').textContent()) || '[]')
  assert.equal(results.length, 1)
  assert.equal(results[0].status, 'pass', results[0].error)
  await page.locator('#TestOverlay').evaluate((element) => element.remove())
  const source = 'const color = "#ff0000"\nconst scene = "threejs"'
  await page.locator('.Editor textarea').focus()
  await page.keyboard.press('ControlOrMeta+a')
  await page.locator('.Editor textarea').evaluate((target, text) => {
    const clipboardData = new DataTransfer()
    clipboardData.setData('text/plain', text)
    target.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData }))
  }, source)
  const worker = page.workers().find((worker) => worker.url().includes('/renderer-worker/'))
  assert.ok(worker, 'Renderer worker must be running')
  const entry = worker.url().replace('/renderer-worker/dist/rendererWorkerMain.js', '/renderer-process/dist/rendererProcessMain.js')
  await page.waitForFunction(
    async ({ entry, source }) => {
      const renderer = await import(entry)
      const document = await renderer.executeCommand('GetActiveEditor.getTextDocument')
      return document?.text === source
    },
    { entry, source },
  )
  process.stdout.write('Native multiline clipboard paste passed\n')
} finally {
  await browser?.close()
  if (server.exitCode === null) {
    const exited = once(server, 'exit')
    server.kill()
    await exited
  }
}
