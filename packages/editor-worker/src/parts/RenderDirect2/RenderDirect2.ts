import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import * as RenderedDoms from '../RenderedDoms/RenderedDoms.ts'
import { render2 } from '../Render2/Render2.ts'

const queues = new Map<number, Promise<readonly any[]>>()
const focusCommands = new Set([
  'Viewlet.focus',
  'Viewlet.focusSelector',
  'Viewlet.setFocusContext',
  'Viewlet.setAdditionalFocus',
  'Viewlet.unsetAdditionalFocus',
])

const renderDirect = async (uid: number, preserveFocus: boolean): Promise<readonly any[]> => {
  const instance = EditorStates.get(uid)
  if (!instance) return []
  const { newState, oldState } = instance
  const oldDom = RenderedDoms.get(uid)
  const oldPaths = RenderedDoms.getTextAppendPaths(uid)
  try {
    const commands = render2(uid, [])
    const result = []
    for (const command of commands) {
      if (preserveFocus && focusCommands.has(command[0])) continue
      // Widget creation/declarations and focus contexts must still pass through
      // renderer-worker. Replace only DOM patches, preserving command order.
      if (RendererProcess.isConnected() && command[0] === 'Viewlet.setPatches' && command[1] === uid) {
        const transactionId = await RendererProcess.invoke('Viewlet.queueCommands', uid, [command])
        result.push(['Viewlet.commitPending', uid, transactionId])
      } else {
        result.push(command)
      }
    }
    return result
  } catch (error) {
    const latest = EditorStates.get(uid)
    if (latest?.newState.lifecycle === newState.lifecycle && latest.oldState === newState) {
      // A rejected queue RPC must not acknowledge patches that never arrived.
      EditorStates.set(uid, oldState, latest.newState)
      if (oldDom) RenderedDoms.set(uid, oldDom, oldPaths)
      else RenderedDoms.dispose(uid)
    }
    throw error
  }
}

export const renderDirect2 = (uid: number, preserveFocus = false): Promise<readonly any[]> => {
  const lifecycle = EditorStates.get(uid)?.newState.lifecycle
  const previous = queues.get(uid) || Promise.resolve([])
  const current = previous
    .catch(() => [])
    .then(() => {
      if (EditorStates.get(uid)?.newState.lifecycle !== lifecycle) return []
      return renderDirect(uid, preserveFocus)
    })
  queues.set(uid, current)
  const cleanup = () => {
    if (queues.get(uid) === current) queues.delete(uid)
  }
  void current.then(cleanup, cleanup)
  return current
}
