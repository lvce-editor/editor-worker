import * as Preferences from '../Preferences/Preferences.ts'

const kLineHeight = 'editor.lineHeight'
const kFontSize = 'editor.fontSize'
const kFontFamily = 'editor.fontFamily'
const kLetterSpacing = 'editor.letterSpacing'
const kLinks = 'editor.links'
const kTabSize = 'editor.tabSize'
const kLineNumbers = 'editor.lineNumbers'
const kFormatOnSave = 'editor.formatOnSave'
const kDiagnostics = 'editor.diagnostics'
const kQuickSuggestions = 'editor.quickSuggestions'
const kAutoClosingQuotes = 'editor.autoClosingQuotes'
const kAutoClosingBrackets = 'editor.autoclosingBrackets'
const kFontWeight = 'editor.fontWeight'
const kHover = 'editor.hover'

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

export const getHoverEnabled = async () => {
  return (await Preferences.get(kHover)) ?? false
}

export const getFontFamily = async () => {
  return (await Preferences.get(kFontFamily)) || 'Fira Code'
}

export const getLetterSpacing = async () => {
  if (!false) {
    return 0
  }
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

export const getCompletionTriggerCharacters = async () => {
  return ['.', '/']
}

export const getFormatOnSave = async () => {
  return (await Preferences.get(kFormatOnSave)) ?? false
}

export const diagnosticsEnabled = async () => {
  return (await Preferences.get(kDiagnostics)) ?? false
}

export const getFontWeight = async () => {
  return (await Preferences.get(kFontWeight)) ?? 400
}
