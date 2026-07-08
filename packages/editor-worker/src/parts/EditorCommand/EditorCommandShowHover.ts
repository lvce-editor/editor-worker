import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorState } from '../State/State.ts'

const EditorHover = 'EditorHover'

export const showHover = async (state: EditorState): Promise<EditorState> => {
  await RendererWorker.invoke('Viewlet.openWidget', EditorHover)
  return state
}
