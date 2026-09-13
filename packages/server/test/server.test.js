import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

test('server links the local editor worker package', { timeout: 20_000 }, async ({ signal }) => {
  const profile = await mkdtemp(join(tmpdir(), 'editor-worker-link-'))
  const workerPath = fileURLToPath(new URL('../../../.tmp/dist/dist/editorWorkerMain.js', import.meta.url))
  const worker = await readFile(workerPath, 'utf8')
  const child = spawn(process.execPath, [fileURLToPath(new URL('../src/server.js', import.meta.url))], {
    env: {
      ...process.env,
      PORT: '0',
      XDG_CACHE_HOME: join(profile, 'cache'),
      XDG_CONFIG_HOME: join(profile, 'config'),
      XDG_DATA_HOME: join(profile, 'data'),
      XDG_STATE_HOME: join(profile, 'state'),
    },
    signal,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  try {
    let output = ''
    let address = ''
    for await (const chunk of child.stdout) {
      output += chunk.toString()
      address = output.match(/http:\/\/[^\s]+/)?.[0] || ''
      if (address) {
        break
      }
    }
    assert.ok(address, 'server must report its listening address')
    const response = await fetch(address)
    assert.equal(response.status, 200)
    const html = await response.text()
    const configText = html.match(/<script type="application\/json" id="Config">([\s\S]*?)<\/script>/)?.[1]
    assert.ok(configText, 'server must emit linked worker configuration')
    const config = JSON.parse(configText)
    assert.ok(config.editorWorkerUrl.includes('/.tmp/dist/dist/editorWorkerMain.js'))
    const workerResponse = await fetch(new URL(config.editorWorkerUrl, address))
    assert.equal(workerResponse.status, 200)
    assert.equal(await workerResponse.text(), worker)
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit')
      child.kill()
      await exited
    }
    await rm(profile, { recursive: true, force: true })
  }
})
