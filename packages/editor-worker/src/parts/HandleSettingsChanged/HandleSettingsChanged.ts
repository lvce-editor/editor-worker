import { WidgetId } from '@lvce-editor/constants'
import type { EditorState } from '../State/State.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import * as EditorHoverState from '../EditorHoverState/EditorHoverState.ts'
import * as FindWidgetWorker from '../FindWidgetWorker/FindWidgetWorker.ts'
import { getDocumentSymbols } from '../GetDocumentSymbols/GetDocumentSymbols.ts'
import { getEditorGutterDecorations } from '../GetEditorGutterDecorations/GetEditorGutterDecorations.ts'
import { getEditorPreferences } from '../GetEditorPreferences/GetEditorPreferences.ts'
import { getLargeFilePreferences } from '../LargeFilePreferences/LargeFilePreferences.ts'
import * as MeasureCharacterWidth from '../MeasureCharacterWidth/MeasureCharacterWidth.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import * as Resize from '../Resize/Resize.ts'
import * as UpdateWidget from '../UpdateWidget/UpdateWidget.ts'

const getWorkspaceUri = async (applicationId?: string): Promise<string> => {
  try {
    return await ApplicationRpc.invoke(applicationId, 'Workspace.getPath')
  } catch {
    return ''
  }
}

const updateFindWidget = async (state: EditorState): Promise<EditorState> => {
  const widget = (state.widgets || []).find((widget: any) => widget.id === WidgetId.Find)
  if (!widget) {
    return state
  }
  const { uid } = widget.newState
  await FindWidgetWorker.invoke('FindWidget.handleSettingsChanged', uid)
  const diff = await FindWidgetWorker.invoke('FindWidget.diff2', uid)
  const commands = await FindWidgetWorker.invoke('FindWidget.render2', uid, diff)
  return UpdateWidget.updateWidget(state, WidgetId.Find, {
    ...widget.newState,
    commands,
  })
}

export const handleSettingsChanged = async (state: EditorState): Promise<EditorState> => {
  const editorPreferences = { ...(await getEditorPreferences()), ...(state.largeFile && getLargeFilePreferences()) }
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
    completionsOnType: !state.largeFile && Boolean(completionsOnTypeRaw),
    diagnostics: diagnosticsEnabled ? state.diagnostics : [],
    isMonospaceFont,
    itemHeight: rowHeight,
    minimapRevision: (state.minimapRevision || 0) + (minimapEnabled ? 1 : 0),
    visualDecorations: diagnosticsEnabled ? state.visualDecorations : [],
  }
  if (!editorWithUpdatedSettings.hoverEnabled) {
    EditorHoverState.clear(state.uid)
  }
  let documentSymbols = state.documentSymbols || []
  let workspaceUri = state.workspaceUri || ''
  if (!breadcrumbsEnabled) {
    documentSymbols = []
    workspaceUri = ''
  } else if (!state.breadcrumbsEnabled) {
    ;[documentSymbols, workspaceUri] = await Promise.all([getDocumentSymbols(editorWithUpdatedSettings), getWorkspaceUri(state.applicationId)])
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
  const editorWithUpdatedFindWidget = await updateFindWidget(resizedEditor)
  return {
    ...editorWithUpdatedFindWidget,
    gutterDecorations: await getEditorGutterDecorations(editorWithUpdatedFindWidget),
  }
}
