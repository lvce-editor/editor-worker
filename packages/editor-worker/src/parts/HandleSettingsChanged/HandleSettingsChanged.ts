import type { EditorState } from '../State/State.ts'
import { getEditorPreferences } from '../GetEditorPreferences/GetEditorPreferences.ts'
import * as MeasureCharacterWidth from '../MeasureCharacterWidth/MeasureCharacterWidth.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import * as Resize from '../Resize/Resize.ts'

export const handleSettingsChanged = async (state: EditorState): Promise<EditorState> => {
  const editorPreferences = await getEditorPreferences()
  const { diagnosticsEnabled, fontFamily, fontSize, fontWeight, letterSpacing, rowHeight } = editorPreferences
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
    visualDecorations: diagnosticsEnabled ? state.visualDecorations : [],
  }
  return Resize.resize(editorWithUpdatedSettings, {}, charWidth)
}
