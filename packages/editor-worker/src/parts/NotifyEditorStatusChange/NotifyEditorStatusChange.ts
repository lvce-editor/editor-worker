import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import type { EditorState } from '../State/State.ts'
import * as EditorListeners from '../EditorListeners/EditorListeners.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as EditorStatusDelivery from '../EditorStatusDelivery/EditorStatusDelivery.ts'
import { getEditorStatus } from '../GetEditorStatus/GetEditorStatus.ts'
import * as ListenerType from '../ListenerType/ListenerType.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

const sendToListener = async (rpcId: number, status: EditorStatus | undefined): Promise<void> => {
  const rpc = RpcRegistry.get(rpcId)
  if (rpc) {
    await EditorStatusDelivery.send(rpcId, rpc, status)
  }
}

export const initializeListener = async (rpcId: number): Promise<void> => {
  if (!EditorListeners.getListeners(ListenerType.EditorSelection).includes(rpcId)) {
    return
  }
  const editor = EditorStates.getKeys()
    .map((uid) => EditorStates.get(Number(uid))?.newState)
    .find((state) => {
      const { focused, initial } = state || {}
      return focused && !initial
    })
  await sendToListener(rpcId, editor ? getEditorStatus(editor) : undefined)
}

export const notifyEditorStatusChange = async (_oldEditor: EditorState, newEditor: EditorState): Promise<void> => {
  if (newEditor.initial || !newEditor.focused) {
    return
  }
  const status = getEditorStatus(newEditor)
  await Promise.all(EditorListeners.getListeners(ListenerType.EditorSelection).map((rpcId) => sendToListener(rpcId, status)))
}

export const notifyEditorStatusCleared = async (): Promise<void> => {
  await Promise.all(EditorListeners.getListeners(ListenerType.EditorSelection).map((rpcId) => sendToListener(rpcId, undefined)))
}
