import * as I18nString from '../I18NString/I18NString.ts'

const UiStrings = {
  Copy: 'Copy',
  CopyLineDown: 'Copy Line Down',
  CopyLineUp: 'Copy Line Up',
  Cut: 'Cut',
  DuplicateSelection: 'Duplicate Selection',
  EditorCloseColorPicker: 'Editor: Close Color Picker',
  EditorCopyLineDown: 'Editor: Copy Line Down',
  EditorCopyLineUp: 'Editor: Copy Line Up',
  EditorFormatDocumentForced: 'Editor: Format Document (forced)',
  EditorGoToDefinition: 'Editor: Go To Definition',
  EditorGoToTypeDefinition: 'Editor: Go To Type Definition',
  EditorIndent: 'Editor: Indent',
  EditorOpenColorPicker: 'Editor: Open Color Picker',
  EditorSelectAllOccurrences: 'Editor: Select All Occurrences',
  EditorSelectDown: 'Editor: Select Down',
  EditorSelectInsideString: 'Editor: Select Inside String',
  EditorSelectNextOccurrence: 'Editor: Select Next Occurrence',
  EditorSelectUp: 'Editor: Select Up',
  EditorShowHover: 'Show Hover',
  EditorSortLinesAscending: 'Editor: Sort Lines Ascending',
  EditorToggleBlockComment: 'Editor: Toggle Block Comment',
  EditorToggleComment: 'Editor: Toggle Comment',
  EditorUnindent: 'Editor: Unindent',
  EnterCode: 'Enter Code',
  EscapeToClose: 'Escape to close',
  FindAllImplementations: 'Find All Implementations',
  FindAllReferences: 'Find All References',
  FormatDocument: 'Format Document',
  GoToDefinition: 'Go to Definition',
  GoToTypeDefinition: 'Go to Type Definition',
  MoveLineDown: 'Move Line Down',
  MoveLineUp: 'Move Line Up',
  NoCodeActionsAvailable: 'No code actions available',
  NoDefinitionFound: 'No definition found',
  NoDefinitionFoundFor: "No definition found for '{PH1}'",
  NoResults: 'No Results',
  NoTypeDefinitionFound: 'No type definition found',
  NoTypeDefinitionFoundFor: "No type definition found for '{PH1}'",
  OrganizeImports: 'Organize Imports',
  Paste: 'Paste',
  Redo: 'Redo',
  Replace: 'Replace',
  SelectAll: 'Select All',
  Separator: 'Separator',
  SortImports: 'Sort Imports',
  SourceAction: 'Source Action',
  SourceActions: 'Source Actions',
  ToggleBlockComment: 'Toggle Block Comment',
  ToggleLineComment: 'Toggle Line Comment',
  Undo: 'Undo',
}

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
