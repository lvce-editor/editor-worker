import { chromium } from 'playwright'
import { threshold, workerPath } from './config.ts'
import { MemoryLimitExceededError } from './errors.ts'
import { getMemoryUsageWs } from './getMemoryUsageWs.ts'
import { parseArgs } from './parseArgs.ts'
import { startServer } from './server.ts'
import { waitForWorkerReady } from './waitForWorkerReady.ts'

const main = async () => {
  const options = parseArgs()

  const server = await startServer(options.port, workerPath)

  const remoteDebuggingPort = '9222'
  const browser = await chromium.launch({
    headless: options.headless,
    args: [`--remote-debugging-port=${remoteDebuggingPort}`],
  })

  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    await page.goto(`http://localhost:${options.port}`)
    await waitForWorkerReady(page)

    const memoryUsage = await getMemoryUsageWs(remoteDebuggingPort)
    console.log('[memory] Worker Memory Usage:', memoryUsage)
    if (memoryUsage.usedSize >= threshold) {
      throw new MemoryLimitExceededError(threshold, memoryUsage.usedSize)
    }
  } catch (error) {
    console.error('[memory] Measurement failed:', error)
    process.exit(1)
  } finally {
    server.close()
    await browser.close()
  }
}

main()
