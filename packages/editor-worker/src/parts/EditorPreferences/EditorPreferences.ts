import * as Logger from '../Logger/Logger.ts'
import * as Preferences from '../Preferences/Preferences.ts'

const getPreference = (key: string, applicationId?: string): Promise<any> =>
  applicationId === undefined ? Preferences.get(key) : Preferences.get(key, applicationId)

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

export const isAutoClosingBracketsEnabled = async (applicationId?: string) => {
  return Boolean(await getPreference(kAutoClosingBrackets, applicationId))
}

export const isAutoClosingQuotesEnabled = async (applicationId?: string) => {
  return Boolean(await getPreference(kAutoClosingQuotes, applicationId))
}

export const isQuickSuggestionsEnabled = async (applicationId?: string) => {
  return Boolean(await getPreference(kQuickSuggestions, applicationId))
}

export const isAutoClosingTagsEnabled = async () => {
  return true
}

export const getRowHeight = async (applicationId?: string) => {
  const [lineHeight, fontSize] = await Promise.all([getPreference(kLineHeight, applicationId), getFontSize(applicationId)])
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

export const getFontSize = async (applicationId?: string) => {
  const fontSize = await getPreference(kFontSize, applicationId)
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

export const getFontFamily = async (applicationId?: string) => {
  return (await getPreference(kFontFamily, applicationId)) || 'Fira Code'
}

export const getLetterSpacing = async (applicationId?: string) => {
  // if (!false) {
  //   return 0
  // }
  return (await getPreference(kLetterSpacing, applicationId)) ?? 0.5
}

export const getTabSize = async (applicationId?: string) => {
  return (await getPreference(kTabSize, applicationId)) || 2
}

export const getLinks = async (applicationId?: string) => {
  return (await getPreference(kLinks, applicationId)) || false
}

export const getLineNumbers = async (applicationId?: string) => {
  return (await getPreference(kLineNumbers, applicationId)) ?? false
}

export const getHighlightActiveLineNumber = async (applicationId?: string) => {
  return (await getPreference(kHighlightActiveLineNumber, applicationId)) ?? true
}

export const getCompletionTriggerCharacters = async () => {
  return ['.', '/']
}

export const getFontWeight = async (applicationId?: string) => {
  return (await getPreference(kFontWeight, applicationId)) ?? 400
}

export const getMinimapEnabled = async (applicationId?: string) => {
  return (await getPreference(kMinimapEnabled, applicationId)) ?? false
}

export const getMergeConflictActionsEnabled = async (applicationId?: string) => {
  return (await getPreference(kMergeConflictActions, applicationId)) ?? false
}
