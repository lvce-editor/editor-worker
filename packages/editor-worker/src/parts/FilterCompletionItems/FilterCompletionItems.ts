import * as FuzzySearch from '@lvce-editor/fuzzy-search'
import * as Character from '../Character/Character.ts'
import * as CompletionItemFlags from '../CompletionItemFlags/CompletionItemFlags.ts'
import * as EmptyMatches from '../EmptyMatches/EmptyMatches.ts'

const addEmptyMatch = (item: any) => {
  return {
    ...item,
    matches: EmptyMatches.EmptyMatches,
  }
}

export const filterCompletionItems = (completionItems: any, word: string) => {
  if (word === Character.EmptyString) {
    return completionItems.map(addEmptyMatch)
  }
  const filteredCompletions = []
  const deprecated = []
  for (const completionItem of completionItems) {
    const { label, flags } = completionItem
    const result = FuzzySearch.fuzzySearch(word, label)
    if (result.length > 0) {
      if (flags & CompletionItemFlags.Deprecated) {
        // TODO avoid mutation
        completionItem.matches = EmptyMatches.EmptyMatches
        deprecated.push(completionItem)
      } else {
        // TODO avoid mutation
        completionItem.matches = result
        filteredCompletions.push(completionItem)
      }
    }
  }
  if (deprecated.length > 0) {
    filteredCompletions.push(...deprecated)
  }
  return filteredCompletions
}
