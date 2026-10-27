/// <reference lib="dom" />
import assert from 'node:assert/strict'
import { fork } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { root } from './root.ts'

const port = 3014
const profile = await mkdtemp(join(tmpdir(), 'lvce-syntax-cache-'))
const server = fork(join(root, 'packages/server/src/server.js'), [], {
  env: { ...process.env, ONLY_EXTENSION: join(root, 'packages/e2e'), PORT: String(port), TEST_PATH: join(root, 'packages/e2e') },
  stdio: ['ignore', 'inherit', 'inherit', 'ipc'],
})

try {
  await Promise.race([
    once(server, 'message'),
    (async (): Promise<never> => {
      await once(server, 'exit')
      throw new Error('Syntax cache test server exited before readiness')
    })(),
  ])
  const run = async (changedSources: readonly string[] = []) => {
    const context = await chromium.launchPersistentContext(profile, { headless: true })
    try {
      for (const changedSource of changedSources) {
        await context.route(`**/editor.persisted-tokens/${changedSource}`, async (route) => {
          const response = await route.fetch()
          await route.fulfill({ response, body: `${await response.text()}\n// changed tokenizer implementation\n` })
        })
      }
      const page = await context.newPage()
      page.setDefaultTimeout(30_000)
      const started = performance.now()
      await page.goto(`http://localhost:${port}/tests/_all.html?filter=editor.persisted-tokens`)
      await page.locator('.TestResults').waitFor({ state: 'attached' })
      const results = JSON.parse((await page.locator('.TestResults').textContent()) || '[]')
      assert.equal(results.length, 1)
      assert.equal(results[0].status, 'pass', results[0].error)
      const persistedBytes = await page.evaluate(async () => {
        const cache = await caches.open('lvce-editor-syntax-highlighting-v1')
        const requests = await cache.keys()
        let size = 0
        for (const request of requests) {
          const response = await cache.match(request)
          const body = await response!.arrayBuffer()
          size += body.byteLength
        }
        return size
      })
      assert.ok(persistedBytes > 0, 'Tokens must be persisted through the real cache worker')
      const counts = await Promise.all(
        page.workers().map((worker) => worker.evaluate(() => Reflect.get(globalThis, 'syntaxCacheTokenizeCalls') || 0)),
      )
      const tokenizeCalls = counts.reduce((sum, count) => sum + count, 0)
      return { tokenizeCalls, persistedBytes, elapsedMs: performance.now() - started }
    } finally {
      await context.close()
    }
  }
  const cold = await run()
  const reopened = await run()
  assert.ok(cold.tokenizeCalls > 0, 'Cold open must tokenize')
  assert.equal(reopened.tokenizeCalls, 0, 'Restart with matching content and code must reuse tokens')
  const changedHelper = await run(['helper.js'])
  assert.ok(changedHelper.tokenizeCalls > 0, 'Imported helper changes must invalidate cached tokens')
  const changedEmbedded = await run(['helper.js', 'embedded.js'])
  assert.ok(changedEmbedded.tokenizeCalls > 0, 'Embedded tokenizer changes must invalidate cached tokens')
  process.stdout.write(JSON.stringify({ cold, reopened, changedHelper, changedEmbedded }) + '\n')
} finally {
  if (server.exitCode === null) {
    const exited = once(server, 'exit')
    server.kill()
    await exited
  }
  await rm(profile, { recursive: true, force: true })
}
