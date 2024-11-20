import CDP from 'chrome-remote-interface'
import type { MemoryUsage } from './types.ts'

export const getMemoryUsageWs = async (debuggingPort: string): Promise<MemoryUsage> => {
  const client = await CDP({
    host: 'localhost',
    port: Number(debuggingPort),
  })
  try {
    const { promise, resolve } = Promise.withResolvers()
    client.Target.attachedToTarget(resolve)
    await client.Target.setAutoAttach({
      autoAttach: true,
      waitForDebuggerOnStart: true,
      flatten: true,
    })
    // @ts-ignore
    const { sessionId } = await promise
    await client.Runtime.enable(sessionId)
    const mem = await client.Runtime.getHeapUsage(sessionId)
    return mem as MemoryUsage
  } finally {
    await client.close()
  }
}
