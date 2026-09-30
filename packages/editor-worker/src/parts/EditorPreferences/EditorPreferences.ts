import * as Logger from '../Logger/Logger.ts'
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
const kMinFontSize = 10
const kMaxFontSize = 100
const kMaxLineHeight = 100
const lastWarnings = new Map<string, unknown>()

const warnIfChanged = (setting: string, value: unknown, bound: number, direction: string) => {
  if (Object.is(lastWarnings.get(setting), value)) {
    return
  }
  lastWarnings.set(setting, value)
  Logger.warn(`[editor-worker] ${setting} value ${value} is too ${direction}; using ${bound}`)
}

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
  const [lineHeight, fontSize] = await Promise.all([Preferences.get(kLineHeight), getFontSize()])
  if (typeof lineHeight !== 'number' || !Number.isFinite(lineHeight) || lineHeight === 0) {
    lastWarnings.delete(kLineHeight)
    return fontSize
  }
  if (lineHeight > kMaxLineHeight) {
    warnIfChanged(kLineHeight, lineHeight, kMaxLineHeight, 'large')
    return kMaxLineHeight
  }
  if (lineHeight < fontSize) {
    warnIfChanged(kLineHeight, lineHeight, fontSize, 'small')
    return fontSize
  }
  lastWarnings.delete(kLineHeight)
  return lineHeight
}

export const getFontSize = async () => {
  const fontSize = await Preferences.get(kFontSize)
  if (typeof fontSize !== 'number' || !Number.isFinite(fontSize)) {
    lastWarnings.delete(kFontSize)
    return 15
  }
  if (fontSize < kMinFontSize) {
    warnIfChanged(kFontSize, fontSize, kMinFontSize, 'small')
    return kMinFontSize
  }
  if (fontSize > kMaxFontSize) {
    warnIfChanged(kFontSize, fontSize, kMaxFontSize, 'large')
    return kMaxFontSize
  }
  lastWarnings.delete(kFontSize)
  return fontSize
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
