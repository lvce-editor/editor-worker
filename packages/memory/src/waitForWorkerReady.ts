import type { Page } from 'playwright'
import * as WorkerState from './workerState.ts'
import { WorkerInitializationError } from './errors.ts'

export const waitForWorkerReady = async (page: Page): Promise<void> => {
  const workerState = await Promise.race([
    // @ts-ignore
    page.waitForFunction(() => window.__workerDidLaunch === 1, { timeout: 5000 }).then(() => WorkerState.Launched),
    // @ts-ignore
    page.waitForFunction(() => window.__workerDidLaunch === 2, { timeout: 5000 }).then(() => WorkerState.Error),
  ])

  if (workerState === WorkerState.Error) {
    throw new WorkerInitializationError('Worker failed to initialize')
  }
}
