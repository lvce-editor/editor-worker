import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorState } from '../State/State.ts'
import { getDocumentSymbols } from '../GetDocumentSymbols/GetDocumentSymbols.ts'
import { getEditorGutterDecorations } from '../GetEditorGutterDecorations/GetEditorGutterDecorations.ts'
import { getEditorPreferences } from '../GetEditorPreferences/GetEditorPreferences.ts'
import * as MeasureCharacterWidth from '../MeasureCharacterWidth/MeasureCharacterWidth.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import * as Resize from '../Resize/Resize.ts'

const getWorkspaceUri = async (): Promise<string> => {
  try {
    return await RendererWorker.invoke('Workspace.getPath')
  } catch {
    return ''
  }
}

export const handleSettingsChanged = async (state: EditorState): Promise<EditorState> => {
  const editorPreferences = await getEditorPreferences()
  const { breadcrumbsEnabled, diagnosticsEnabled, fontFamily, fontSize, fontWeight, letterSpacing, minimapEnabled, rowHeight } = editorPreferences
  const [charWidth, completionsOnTypeRaw] = await Promise.all([
    MeasureCharacterWidth.measureCharacterWidth(fontWeight, fontSize, fontFamily, letterSpacing),
    Preferences.get('editor.completionsOnType'),
  ])
  const isMonospaceFont = fontFamily === 'Fira Code' || fontFamily === "'Fira Code'"
  const editorWithUpdatedSettings: EditorState = {
    ...state,
    ...editorPreferences,
    charWidth,
    completionsOnType: Boolean(completionsOnTypeRaw),
    diagnostics: diagnosticsEnabled ? state.diagnostics : [],
    isMonospaceFont,
    itemHeight: rowHeight,
    minimapRevision: (state.minimapRevision || 0) + (minimapEnabled ? 1 : 0),
    visualDecorations: diagnosticsEnabled ? state.visualDecorations : [],
  }
  let documentSymbols = state.documentSymbols || []
  let workspaceUri = state.workspaceUri || ''
  if (!breadcrumbsEnabled) {
    documentSymbols = []
    workspaceUri = ''
  } else if (!state.breadcrumbsEnabled) {
    ;[documentSymbols, workspaceUri] = await Promise.all([getDocumentSymbols(editorWithUpdatedSettings), getWorkspaceUri()])
  }
  const resizedEditor = Resize.resize(
    {
      ...editorWithUpdatedSettings,
      documentSymbols,
      workspaceUri,
    },
    {},
    charWidth,
  )
  return {
    ...resizedEditor,
    gutterDecorations: await getEditorGutterDecorations(resizedEditor),
  }
}
