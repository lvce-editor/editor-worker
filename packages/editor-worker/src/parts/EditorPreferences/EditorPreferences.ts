import * as Preferences from '../Preferences/Preferences.ts'

const kLineHeight = 'editor.lineHeight'
const kFontSize = 'editor.fontSize'
const kFontFamily = 'editor.fontFamily'
const kLetterSpacing = 'editor.letterSpacing'
const kLinks = 'editor.links'
const kTabSize = 'editor.tabSize'
const kLineNumbers = 'editor.lineNumbers'
const kHighlightActiveLineNumber = 'editor.highlightActiveLineNumber'
const kQuickSuggestions = 'editor.quickSuggestions'
const kAutoClosingQuotes = 'editor.autoClosingQuotes'
const kAutoClosingBrackets = 'editor.autoClosingBrackets'
const kFontWeight = 'editor.fontWeight'
const kMinimapEnabled = 'editor.minimap.enabled'
const kMergeConflictActions = 'editor.mergeConflictActions'

export const isAutoClosingBracketsEnabled = async () => {
  return Boolean(await Preferences.get(kAutoClosingBrackets))
}

export const isAutoClosingQuotesEnabled = async () => {
  return Boolean(await Preferences.get(kAutoClosingQuotes))
}

export const isQuickSuggestionsEnabled = async () => {
  return Boolean(await Preferences.get(kQuickSuggestions))
}

export const isAutoClosingTagsEnabled = async () => {
  return true
}

export const getRowHeight = async () => {
  return (await Preferences.get(kLineHeight)) || 20
}

export const getFontSize = async () => {
  return (await Preferences.get(kFontSize)) || 15 // TODO find out if it is possible to use all numeric values for settings for efficiency, maybe settings could be an array
}

export const getFontFamily = async () => {
  return (await Preferences.get(kFontFamily)) || 'Fira Code'
}

export const getLetterSpacing = async () => {
  // if (!false) {
  //   return 0
  // }
  return (await Preferences.get(kLetterSpacing)) ?? 0.5
}

export const getTabSize = async () => {
  return (await Preferences.get(kTabSize)) || 2
}

export const getLinks = async () => {
  return (await Preferences.get(kLinks)) || false
}

export const getLineNumbers = async () => {
  return (await Preferences.get(kLineNumbers)) ?? false
}

export const getHighlightActiveLineNumber = async () => {
  return (await Preferences.get(kHighlightActiveLineNumber)) ?? true
}

export const getCompletionTriggerCharacters = async () => {
  return ['.', '/']
}

export const getFontWeight = async () => {
  return (await Preferences.get(kFontWeight)) ?? 400
}

export const getMinimapEnabled = async () => {
  return (await Preferences.get(kMinimapEnabled)) ?? false
}

export const getMergeConflictActionsEnabled = async () => {
  return (await Preferences.get(kMergeConflictActions)) ?? false
}
