import * as I18nString from '../I18NString/I18NString.ts'

const UiStrings = {
  GoToDefinition: 'Go to Definition',
  NoDefinitionFound: 'No definition found',
  NoDefinitionFoundFor: "No definition found for '{PH1}'",
  NoTypeDefinitionFound: 'No type definition found',
  NoTypeDefinitionFoundFor: "No type definition found for '{PH1}'",
  NoResults: 'No Results',
  Replace: 'Replace',
  SourceAction: 'Source Action',
  OrganizeImports: 'Organize Imports',
  SortImports: 'Sort Imports',
  NoCodeActionsAvailable: 'No code actions available',
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
