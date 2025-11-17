import * as Editors from '../Editors/Editors.ts'
import { RendererWorker } from '@lvce-editor/rpc-registry'

const filterActions = (sourceActions: readonly any[], languageId: string) => {
  return sourceActions.filter((action) => action.languageId === languageId)
}

// TODO ask extension host worker instead
export const getEditorSourceActions = async (editorId?: number): Promise<readonly any[]> => {
  if (!editorId) {
    return []
  }
  const { newState } = Editors.get(editorId)
  const { languageId } = newState
  // @ts-ignore
  const allActions = await RendererWorker.invoke('GetEditorSourceActions.getEditorSourceActions')
  const filtered = filterActions(allActions, languageId)
  return filtered
}
