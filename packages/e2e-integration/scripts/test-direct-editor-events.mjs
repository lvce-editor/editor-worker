import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export const test = async ({ page }) => {
  await page.locator('#TestOverlay').evaluate((element) => element.remove())
  const rendererWorker = page.workers().find((worker) => /\/renderer-worker\/(?:src|dist)\/rendererWorkerMain/.test(worker.url()))
  assert.ok(
    rendererWorker,
    `Renderer worker missing: ${page
      .workers()
      .map((worker) => worker.url())
      .join(', ')}`,
  )
  assert.ok(rendererWorker.url().includes('/src/'), 'This regression uses the application source server')
  await rendererWorker.evaluate(async () => {
    const { state } = await import('/packages/renderer-worker/src/parts/IsTest/IsTest.js')
    const { isTest } = state
    if (!isTest) throw new Error('Expected the active test runtime state')
    state.isTest = false
    const entries = []
    const instrument = (prototype) => {
      const original = prototype.postMessage
      prototype.postMessage = function (message, ...rest) {
        if (message?.method) entries.push({ method: message.method, params: message.params, time: performance.now() })
        return original.call(this, message, ...rest)
      }
    }
    instrument(MessagePort.prototype)
    instrument(Worker.prototype)
    globalThis.directWorkerTrace = entries
  })
  const entry = await page.evaluate(() => Array.from(document.querySelectorAll('script[type="module"][src]'), (script) => script.src))
  const rendererEntry = entry.find((url) => url.includes('rendererProcessMain'))
  assert.ok(rendererEntry, `Renderer process entry missing: ${entry.join(', ')}`)
  await page.evaluate(() => {
    const ids = new WeakMap()
    let nextId = 0
    const entries = []
    const record = (direction, portId, message) => {
      if (!message?.method) return
      entries.push({ direction, method: message.method, params: message.params, portId, time: performance.now() })
    }
    const instrument = (prototype, kind) => {
      const original = prototype.postMessage
      prototype.postMessage = function (message, ...rest) {
        if (!ids.has(this)) {
          const id = `${kind}-${++nextId}`
          ids.set(this, id)
          this.addEventListener('message', (event) => record('receive', id, event.data))
        }
        record('send', ids.get(this), message)
        return original.call(this, message, ...rest)
      }
    }
    instrument(MessagePort.prototype, 'port')
    instrument(Worker.prototype, 'worker')
    let previousText = ''
    new MutationObserver(() => {
      const text = Array.from(document.querySelectorAll('.Editor .EditorRow'), (row) => row.textContent).join('\n')
      if (text !== previousText) {
        previousText = text
        entries.push({ direction: 'dom', method: 'DOM.text', params: [text], portId: 'dom', time: performance.now() })
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true })
    globalThis.directEditorTrace = entries
  })
  const execute = (method, ...params) =>
    page.evaluate(
      async ({ rendererEntry, method, params }) => {
        const renderer = await import(rendererEntry)
        return renderer.executeCommand(method, ...params)
      },
      { rendererEntry, method, params },
    )
  const executeEditor = async (command) => execute('Viewlet.executeViewletCommand', await execute('GetActiveEditor.getActiveEditorId'), command)
  const executeMain = async (command) => {
    const uid = await page.locator('.Main').evaluate((element) => {
      for (let current = element; current; current = current.parentElement) {
        const key = Object.getOwnPropertySymbols(current).find((symbol) => symbol.description === 'uid')
        if (key) return current[key]
      }
      throw new Error('Main component uid missing')
    })
    return execute('Viewlet.executeViewletCommand', uid, command)
  }
  const initialDocument = await execute('GetActiveEditor.getTextDocument')
  assert.ok(initialDocument?.uri)
  const waitForText = (text) =>
    page.waitForFunction(
      async ({ rendererEntry, text }) => {
        const renderer = await import(rendererEntry)
        const document = await renderer.executeCommand('GetActiveEditor.getTextDocument')
        return document?.text === text
      },
      { rendererEntry, text },
    )
  let input = page.locator('.Editor textarea').last()
  await input.focus()
  await page.keyboard.type('alpha')
  await waitForText('alpha')
  await input.evaluate((target) => {
    target.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: '' }))
    target.dispatchEvent(new CompositionEvent('compositionupdate', { bubbles: true, data: '字' }))
    target.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '字' }))
  })
  await waitForText('alpha字')
  await executeEditor('undo')
  await waitForText('alpha')
  await executeEditor('redo')
  await waitForText('alpha字')
  await input.focus()
  await page.keyboard.press('ControlOrMeta+a')
  await page.keyboard.press('Backspace')
  await waitForText('')
  await executeEditor('openCompletion')
  const completion = page.locator('.EditorCompletionItem').filter({ hasText: 'directCompletion' })
  await completion.waitFor({ state: 'visible' })
  await completion.click()
  await page.locator('.EditorCompletion').waitFor({ state: 'detached' })
  const completedDocument = await execute('GetActiveEditor.getTextDocument')
  assert.ok(completedDocument.text.includes('directCompletion'))
  await executeMain('splitRight')
  assert.equal(await page.locator('.EditorGroup').count(), 2)
  input = page.locator('.Editor textarea').last()
  await input.focus()
  await page.keyboard.type('x')
  await waitForText(`${completedDocument.text}x`)
  for (const editor of await page.locator('.Editor').all()) {
    await page.waitForFunction((element) => element.textContent?.includes('directCompletion'), await editor.elementHandle())
  }
  assert.ok(await input.evaluate((target) => document.activeElement === target))
  await executeMain('closeAllEditors')
  await execute('Main.openUri', initialDocument.uri)
  input = page.locator('.Editor textarea').last()
  await input.focus()
  await page.keyboard.type('z')
  await waitForText('z')
  await execute('Layout.openProblems')
  await page.locator('.Problems').waitFor({ state: 'visible' })
  const burstStart = await rendererWorker.evaluate(() => globalThis.directWorkerTrace.length)
  const comparisonUids = await page.evaluate(() => {
    const activity = document.querySelector('.ActivityBar')
    const explorer = document.querySelector('.Explorer [role="tree"]')
    const problems = document.querySelector('.Problems')
    const uidOf = (element) => {
      for (let current = element; current; current = current.parentElement) {
        const key = Object.getOwnPropertySymbols(current).find((symbol) => symbol.description === 'uid')
        if (key) return current[key]
      }
      throw new Error('Component uid missing')
    }
    if (!activity || !explorer || !problems) throw new Error('Comparison views must all exist')
    const input = document.querySelector('.Editor textarea')
    for (let i = 0; i < 20; i++)
      input.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, cancelable: true, data: 'b', inputType: 'insertText' }))
    explorer.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaY: 1 }))
    activity.dispatchEvent(new FocusEvent('focus'))
    problems.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaY: 1 }))
    return [uidOf(activity), uidOf(explorer), uidOf(problems)]
  })
  await waitForText(`z${'b'.repeat(20)}`)
  await page.waitForFunction(() => document.querySelector('.Editor .EditorRow')?.textContent?.includes('b'.repeat(20)))
  const workerTrace = await rendererWorker.evaluate(() => globalThis.directWorkerTrace)
  const burstRenders = workerTrace.slice(burstStart).filter((event) => event.method === 'Editor.renderDirect2')
  assert.ok(burstRenders.length > 0 && burstRenders.length < 20, `20 inputs must coalesce, observed ${burstRenders.length} renders`)
  const trace = await page.evaluate(() => globalThis.directEditorTrace)
  const rendererPort = trace.find((event) => event.direction === 'send' && event.method === 'GetActiveEditor.getTextDocument')?.portId
  assert.ok(rendererPort)
  const inputs = trace.filter(
    (event) => event.direction === 'send' && event.method === 'Viewlet.executeViewletCommand' && event.params?.[1] === 'handleBeforeInput',
  )
  assert.ok(inputs.length >= 7, 'Native typing must produce direct input commands')
  assert.ok(
    inputs.every((event) => event.portId !== rendererPort),
    'Native input must bypass renderer-worker',
  )
  for (const uid of comparisonUids) {
    assert.ok(
      trace.some(
        (event) =>
          event.direction === 'send' &&
          event.method === 'Viewlet.executeViewletCommand' &&
          event.params?.[0] === uid &&
          event.portId !== rendererPort,
      ),
      `Comparison view ${uid} must receive events directly`,
    )
  }
  assert.ok(!workerTrace.some((event) => event.method === 'Editor.handleBeforeInput'), 'Renderer-worker must not forward editor input')
  const queues = trace.filter((event) => event.direction === 'receive' && event.method === 'Viewlet.queueCommands')
  assert.ok(queues.length, 'Editor must queue DOM patches directly in renderer-process')
  const commits = trace.filter(
    (event) =>
      event.direction === 'receive' &&
      event.method === 'Viewlet.sendMultiple' &&
      event.params?.[0]?.some((command) => command[0] === 'Viewlet.commitPending'),
  )
  assert.ok(commits.length, 'Renderer-worker must commit queued patches')
  const firstBurst = inputs.find((event) => event.params[3] === 'b')
  const finalDom = trace.find((event) => event.method === 'DOM.text' && event.params?.[0] === `z${'b'.repeat(20)}`)
  assert.ok(firstBurst && finalDom, 'Burst input and final DOM timestamps must be captured')
  const metrics = {
    burstLatencyMs: finalDom.time - firstBurst.time,
    burstRenderCount: burstRenders.length,
    rendererForwardedInputCount: workerTrace.filter((event) => event.method === 'Editor.handleBeforeInput').length,
  }
  const evidence = process.env.LVCE_DIRECT_EVENTS_EVIDENCE_DIR || '.tmp/direct-editor-events'
  await mkdir(evidence, { recursive: true })
  await writeFile(
    join(evidence, 'native-input-trace.json'),
    JSON.stringify({ timeline: { entries: trace, dropped: 0 }, workerTrace, metrics, realFrames: true }, null, 2),
  )
}
