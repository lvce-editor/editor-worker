import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as Editors from '../EditorStates/EditorStates.ts'

interface SourceAction {
  readonly languageId?: string
}

interface Extension {
  readonly codeActions?: readonly SourceAction[]
  readonly disabled?: boolean
}

export const getEditorSourceActions = async (editorId?: number): Promise<readonly any[]> => {
  if (!editorId) {
    return []
  }
  const { newState } = Editors.get(editorId)
  const extensions: readonly Extension[] = await ExtensionManagementWorker.invoke('Extensions.getAllExtensions', newState.assetDir, newState.platform)
  return extensions
    .filter((extension) => !extension.disabled)
    .flatMap((extension) => extension.codeActions || [])
    .filter((action) => action.languageId === newState.languageId)
}
