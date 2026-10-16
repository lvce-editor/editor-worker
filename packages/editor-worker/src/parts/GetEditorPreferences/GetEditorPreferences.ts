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

export const getEditorPreferences = async (applicationId?: string) => {
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
    Preferences.get('editor.diagnostics', applicationId),
    EditorPreferences.getFontFamily(applicationId),
    EditorPreferences.getFontSize(applicationId),
    EditorPreferences.getFontWeight(applicationId),
    Preferences.get('editor.formatOnSave', applicationId),
    Preferences.get('editor.hover', applicationId),
    Preferences.get('editor.hoverDelay', applicationId),
    Preferences.get('editor.horizontalVirtualizationThreshold', applicationId),
    Preferences.get('editor.messageDelay', applicationId),
    EditorPreferences.isAutoClosingBracketsEnabled(applicationId),
    EditorPreferences.isAutoClosingQuotesEnabled(applicationId),
    EditorPreferences.isAutoClosingTagsEnabled(),
    EditorPreferences.isQuickSuggestionsEnabled(applicationId),
    EditorPreferences.getLineNumbers(applicationId),
    EditorPreferences.getHighlightActiveLineNumber(applicationId),
    EditorPreferences.getRowHeight(applicationId),
    EditorPreferences.getTabSize(applicationId),
    EditorPreferences.getLetterSpacing(applicationId),
    EditorPreferences.getCompletionTriggerCharacters(),
    EditorPreferences.getMinimapEnabled(applicationId),
    EditorPreferences.getMergeConflictActionsEnabled(applicationId),
    Preferences.get('breadcrumbs.enabled', applicationId),
    Preferences.get('editor.insertSpaces', applicationId),
    Preferences.get('editor.dragAndDrop', applicationId),
    Preferences.get('editor.roundedSelection', applicationId),
    Preferences.get('editor.combineWhitespaceTokens', applicationId),
    Preferences.get('editor.selectedTextOccurrenceMatching', applicationId),
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
