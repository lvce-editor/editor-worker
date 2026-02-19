import * as EditorPreferences from '../EditorPreferences/EditorPreferences.ts'

export const getEditorPreferences = async () => {
  const [
    diagnosticsEnabled,
    fontFamily,
    fontSize,
    fontWeight,
    isAutoClosingBracketsEnabled,
    isAutoClosingQuotesEnabled,
    isAutoClosingTagsEnabled,
    isQuickSuggestionsEnabled,
    lineNumbers,
    rowHeight,
    tabSize,
    letterSpacing,
    completionTriggerCharacters,
  ] = await Promise.all([
    EditorPreferences.diagnosticsEnabled(),
    EditorPreferences.getFontFamily(),
    EditorPreferences.getFontSize(),
    EditorPreferences.getFontWeight(),
    EditorPreferences.isAutoClosingBracketsEnabled(),
    EditorPreferences.isAutoClosingQuotesEnabled(),
    EditorPreferences.isAutoClosingTagsEnabled(),
    EditorPreferences.isQuickSuggestionsEnabled(),
    EditorPreferences.getLineNumbers(),
    EditorPreferences.getRowHeight(),
    EditorPreferences.getTabSize(),
    EditorPreferences.getLetterSpacing(),
    EditorPreferences.getCompletionTriggerCharacters(),
  ])
  return {
    diagnosticsEnabled,
    fontFamily,
    fontSize,
    fontWeight,
    isAutoClosingBracketsEnabled,
    isAutoClosingQuotesEnabled,
    isAutoClosingTagsEnabled,
    isQuickSuggestionsEnabled,
    lineNumbers,
    rowHeight,
    tabSize,
    letterSpacing,
    completionTriggerCharacters,
  }
}
