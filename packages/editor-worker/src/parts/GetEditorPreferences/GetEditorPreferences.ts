import * as EditorPreferences from '../EditorPreferences/EditorPreferences.ts'
import * as Preferences from '../Preferences/Preferences.ts'

const DEFAULT_HOVER_DELAY = 200

const getHoverDelay = (value: unknown): number => {
  const delay = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(delay) || delay < 0) {
    return DEFAULT_HOVER_DELAY
  }
  return delay
}

export const getEditorPreferences = async () => {
  const [
    diagnosticsEnabled,
    fontFamily,
    fontSize,
    fontWeight,
    formatOnSave,
    hoverEnabled,
    hoverDelay,
    isAutoClosingBracketsEnabled,
    isAutoClosingQuotesEnabled,
    isAutoClosingTagsEnabled,
    isQuickSuggestionsEnabled,
    lineNumbers,
    highlightActiveLineNumber,
    rowHeight,
    tabSize,
    letterSpacing,
    completionTriggerCharacters,
    minimapEnabled,
    mergeConflictActionsEnabled,
    breadcrumbsEnabled,
    insertSpaces,
    dragAndDropEnabled,
    roundedSelection,
    combineWhitespaceTokens,
  ] = await Promise.all([
    Preferences.get('editor.diagnostics'),
    EditorPreferences.getFontFamily(),
    EditorPreferences.getFontSize(),
    EditorPreferences.getFontWeight(),
    Preferences.get('editor.formatOnSave'),
    Preferences.get('editor.hover'),
    Preferences.get('editor.hoverDelay'),
    EditorPreferences.isAutoClosingBracketsEnabled(),
    EditorPreferences.isAutoClosingQuotesEnabled(),
    EditorPreferences.isAutoClosingTagsEnabled(),
    EditorPreferences.isQuickSuggestionsEnabled(),
    EditorPreferences.getLineNumbers(),
    EditorPreferences.getHighlightActiveLineNumber(),
    EditorPreferences.getRowHeight(),
    EditorPreferences.getTabSize(),
    EditorPreferences.getLetterSpacing(),
    EditorPreferences.getCompletionTriggerCharacters(),
    EditorPreferences.getMinimapEnabled(),
    EditorPreferences.getMergeConflictActionsEnabled(),
    Preferences.get('breadcrumbs.enabled'),
    Preferences.get('editor.insertSpaces'),
    Preferences.get('editor.dragAndDrop'),
    Preferences.get('editor.roundedSelection'),
    Preferences.get('editor.combineWhitespaceTokens'),
  ])
  return {
    breadcrumbsEnabled: breadcrumbsEnabled ?? false,
    combineWhitespaceTokens: combineWhitespaceTokens ?? true,
    completionTriggerCharacters,
    diagnosticsEnabled: diagnosticsEnabled ?? false,
    dragAndDropEnabled: dragAndDropEnabled ?? true,
    fontFamily,
    fontSize,
    fontWeight,
    formatOnSave: formatOnSave ?? false,
    highlightActiveLineNumber,
    hoverEnabled: hoverEnabled ?? false,
    hoverDelay: getHoverDelay(hoverDelay),
    insertSpaces: insertSpaces ?? true,
    isAutoClosingBracketsEnabled,
    isAutoClosingQuotesEnabled,
    isAutoClosingTagsEnabled,
    isQuickSuggestionsEnabled,
    letterSpacing,
    lineNumbers,
    mergeConflictActionsEnabled,
    minimapEnabled,
    roundedSelection: roundedSelection === true,
    rowHeight,
    tabSize,
  }
}
