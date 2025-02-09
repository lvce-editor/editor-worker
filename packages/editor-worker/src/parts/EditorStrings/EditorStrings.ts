import * as I18nString from '../I18NString/I18NString.ts'
import * as UiStrings from '../UiStrings/UiStrings.ts'

export const goToDefinition = () => {
  return I18nString.i18nString(UiStrings.GoToDefinition)
}

export const noDefinitionFound = () => {
  return I18nString.i18nString(UiStrings.NoDefinitionFound)
}

export const noDefinitionFoundFor = (word: string) => {
  return I18nString.i18nString(UiStrings.NoDefinitionFoundFor, {
    PH1: word,
  })
}

export const noTypeDefinitionFoundFor = (word: string) => {
  return I18nString.i18nString(UiStrings.NoTypeDefinitionFoundFor, {
    PH1: word,
  })
}

export const noTypeDefinitionFound = () => {
  return I18nString.i18nString(UiStrings.NoTypeDefinitionFound)
}

export const noResults = () => {
  return I18nString.i18nString(UiStrings.NoResults)
}

export const replace = () => {
  return I18nString.i18nString(UiStrings.Replace)
}

export const sourceAction = () => {
  return I18nString.i18nString(UiStrings.SourceAction)
}

export const organizeImports = () => {
  return I18nString.i18nString(UiStrings.OrganizeImports)
}

export const sortImports = () => {
  return I18nString.i18nString(UiStrings.SortImports)
}

export const noCodeActionsAvailable = () => {
  return I18nString.i18nString(UiStrings.NoCodeActionsAvailable)
}

export const escapeToClose = () => {
  return I18nString.i18nString(UiStrings.EscapeToClose)
}

export const enterCode = () => {
  return I18nString.i18nString(UiStrings.EnterCode)
}

export const goToTypeDefinition = () => {
  return I18nString.i18nString(UiStrings.GoToTypeDefinition)
}

export const findAllReferences = () => {
  return I18nString.i18nString(UiStrings.FindAllReferences)
}

export const findAllImplementations = () => {
  return I18nString.i18nString(UiStrings.FindAllImplementations)
}

export const cut = () => {
  return I18nString.i18nString(UiStrings.Cut)
}

export const copy = () => {
  return I18nString.i18nString(UiStrings.Copy)
}

export const paste = () => {
  return I18nString.i18nString(UiStrings.Paste)
}

export const undo = () => {
  return I18nString.i18nString(UiStrings.Undo)
}

export const redo = () => {
  return I18nString.i18nString(UiStrings.Redo)
}

export const toggleLineComment = () => {
  return I18nString.i18nString(UiStrings.ToggleLineComment)
}

export const toggleBlockComment = () => {
  return I18nString.i18nString(UiStrings.ToggleBlockComment)
}

export const separator = () => {
  return ''
}

export const selectAll = () => {
  return I18nString.i18nString(UiStrings.SelectAll)
}

export const copyLineUp = () => {
  return I18nString.i18nString(UiStrings.CopyLineUp)
}

export const copyLineDown = () => {
  return I18nString.i18nString(UiStrings.CopyLineDown)
}

export const moveLineUp = () => {
  return I18nString.i18nString(UiStrings.MoveLineUp)
}

export const moveLineDown = () => {
  return I18nString.i18nString(UiStrings.MoveLineDown)
}

export const duplicateSelection = () => {
  return I18nString.i18nString(UiStrings.DuplicateSelection)
}

export const formatDocument = () => {
  return I18nString.i18nString(UiStrings.FormatDocument)
}

export const editorShowHover = () => {
  return I18nString.i18nString(UiStrings.EditorShowHover)
}

export const editorFormatDocumentForced = () => {
  return I18nString.i18nString(UiStrings.EditorFormatDocumentForced)
}

export const editorSelectNextOccurrence = () => {
  return I18nString.i18nString(UiStrings.EditorSelectNextOccurrence)
}

export const editorSelectAllOccurrences = () => {
  return I18nString.i18nString(UiStrings.EditorSelectAllOccurrences)
}

export const editorGoToDefinition = () => {
  return I18nString.i18nString(UiStrings.EditorGoToDefinition)
}

export const editorGoToTypeDefinition = () => {
  return I18nString.i18nString(UiStrings.EditorGoToTypeDefinition)
}

export const editorSelectInsideString = () => {
  return I18nString.i18nString(UiStrings.EditorSelectInsideString)
}

export const editorIndent = () => {
  return I18nString.i18nString(UiStrings.EditorIndent)
}

export const editorUnindent = () => {
  return I18nString.i18nString(UiStrings.EditorUnindent)
}

export const editorSortLinesAscending = () => {
  return I18nString.i18nString(UiStrings.EditorSortLinesAscending)
}

export const editorToggleComment = () => {
  return I18nString.i18nString(UiStrings.EditorToggleComment)
}

export const editorSelectUp = () => {
  return I18nString.i18nString(UiStrings.EditorSelectUp)
}

export const editorSelectDown = () => {
  return I18nString.i18nString(UiStrings.EditorSelectDown)
}

export const editorToggleBlockComment = () => {
  return I18nString.i18nString(UiStrings.EditorToggleBlockComment)
}

export const editorOpenColorPicker = () => {
  return I18nString.i18nString(UiStrings.EditorOpenColorPicker)
}

export const editorCloseColorPicker = () => {
  return I18nString.i18nString(UiStrings.EditorCloseColorPicker)
}

export const editorCopyLineDown = () => {
  return I18nString.i18nString(UiStrings.EditorCopyLineDown)
}

export const editorCopyLineUp = () => {
  return I18nString.i18nString(UiStrings.EditorCopyLineUp)
}
