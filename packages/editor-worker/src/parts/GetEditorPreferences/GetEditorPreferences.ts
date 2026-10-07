import * as EditorPreferences from '../EditorPreferences/EditorPreferences.ts'
import * as Preferences from '../Preferences/Preferences.ts'

const DEFAULT_HOVER_DELAY = 200
const DEFAULT_MESSAGE_DELAY = 3000
const MAX_MESSAGE_DELAY = 10_000
const DEFAULT_SELECTED_TEXT_OCCURRENCE_MATCHING = 'caseSensitive'
const DEFAULT_HORIZONTAL_VIRTUALIZATION_THRESHOLD = 500

const getSelectedTextOccurrenceMatching = (value: unknown): string => {
  return value === 'caseInsensitive' ? value : DEFAULT_SELECTED_TEXT_OCCURRENCE_MATCHING
}

const getHoverDelay = (value: unknown): number => {
  const delay = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(delay) || delay < 0) {
    return DEFAULT_HOVER_DELAY
  }
  return delay
}

const getMessageDelay = (value: unknown): number => {
  const delay = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(delay) || delay < 0 || delay > MAX_MESSAGE_DELAY) {
    return DEFAULT_MESSAGE_DELAY
  }
  return delay
}

const getHorizontalVirtualizationThreshold = (value: unknown): number => {
  const threshold = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100_000) {
    return DEFAULT_HORIZONTAL_VIRTUALIZATION_THRESHOLD
  }
  return Math.floor(threshold)
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
    horizontalVirtualizationThreshold,
    messageDelay,
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
    selectedTextOccurrenceMatching,
  ] = await Promise.all([
    Preferences.get('editor.diagnostics'),
    EditorPreferences.getFontFamily(),
    EditorPreferences.getFontSize(),
    EditorPreferences.getFontWeight(),
    Preferences.get('editor.formatOnSave'),
    Preferences.get('editor.hover'),
    Preferences.get('editor.hoverDelay'),
    Preferences.get('editor.horizontalVirtualizationThreshold'),
    Preferences.get('editor.messageDelay'),
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
    Preferences.get('editor.selectedTextOccurrenceMatching'),
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
    horizontalVirtualizationThreshold: getHorizontalVirtualizationThreshold(horizontalVirtualizationThreshold),
    hoverDelay: getHoverDelay(hoverDelay),
    hoverEnabled: hoverEnabled ?? false,
    insertSpaces: insertSpaces ?? true,
    isAutoClosingBracketsEnabled,
    isAutoClosingQuotesEnabled,
    isAutoClosingTagsEnabled,
    isQuickSuggestionsEnabled,
    letterSpacing,
    lineNumbers,
    mergeConflictActionsEnabled,
    messageDelay: getMessageDelay(messageDelay),
    minimapEnabled,
    roundedSelection: roundedSelection === true,
    rowHeight,
    selectedTextOccurrenceMatching: getSelectedTextOccurrenceMatching(selectedTextOccurrenceMatching),
    tabSize,
  }
}
