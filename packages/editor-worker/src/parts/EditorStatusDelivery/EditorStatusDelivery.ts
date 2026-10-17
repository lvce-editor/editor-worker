import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'

interface StatusRpc {
  invoke(method: string, ...args: readonly any[]): Promise<any>
}

interface Delivery {
  baseline: EditorStatus | undefined
  disposed: boolean
  hasBaseline: boolean
  pending: boolean
  pendingStatus: EditorStatus | undefined
  readonly rpc: StatusRpc
  running: Promise<void> | undefined
  supportsDeltas: boolean | undefined
}

const deliveries = new Map<number, Delivery>()

const getDelta = (previous: EditorStatus, next: EditorStatus): Partial<EditorStatus> => {
  return Object.fromEntries(Object.entries(next).filter(([key, value]) => previous[key as keyof EditorStatus] !== value))
}

const flush = async (delivery: Delivery): Promise<void> => {
  while (delivery.pending && !delivery.disposed) {
    const status = delivery.pendingStatus
    delivery.pending = false
    if (delivery.supportsDeltas === undefined) {
      try {
        delivery.supportsDeltas = (await delivery.rpc.invoke('StatusBar.supportsEditorStatusDeltas')) === true
      } catch {
        delivery.supportsDeltas = false
      }
    }
    if (delivery.disposed) {
      return
    }
    let update: Partial<EditorStatus> | undefined = status
    if (delivery.hasBaseline) {
      if (!delivery.baseline && !status) {
        continue
      }
      if (delivery.baseline && status) {
        const delta = getDelta(delivery.baseline, status)
        if (Object.keys(delta).length === 0) {
          continue
        }
        if (delivery.supportsDeltas) {
          update = delta
        }
      }
    }
    try {
      await delivery.rpc.invoke('StatusBar.handleEditorStatusChanged', update)
      delivery.baseline = status
      delivery.hasBaseline = true
    } catch (error) {
      delivery.baseline = undefined
      delivery.hasBaseline = false
      console.warn('Failed to deliver editor status:', error)
    }
  }
}

const run = async (delivery: Delivery): Promise<void> => {
  try {
    await flush(delivery)
  } finally {
    delivery.running = undefined
  }
  // An update can arrive after flush returns but before this continuation runs.
  if (delivery.pending && !delivery.disposed) {
    await start(delivery)
  }
}

const start = (delivery: Delivery): Promise<void> => {
  delivery.running = run(delivery)
  return delivery.running
}

export const dispose = (rpcId: number): void => {
  const delivery = deliveries.get(rpcId)
  if (delivery) {
    delivery.disposed = true
    deliveries.delete(rpcId)
  }
}

export const clear = (): void => {
  for (const rpcId of deliveries.keys()) {
    dispose(rpcId)
  }
}

export const send = (rpcId: number, rpc: StatusRpc, status: EditorStatus | undefined): Promise<void> => {
  let delivery = deliveries.get(rpcId)
  if (!delivery || delivery.rpc !== rpc) {
    dispose(rpcId)
    delivery = {
      baseline: undefined,
      disposed: false,
      hasBaseline: false,
      pending: false,
      pendingStatus: undefined,
      rpc,
      running: undefined,
      supportsDeltas: undefined,
    }
    deliveries.set(rpcId, delivery)
  }
  delivery.pendingStatus = status
  delivery.pending = true
  return delivery.running || start(delivery)
}
