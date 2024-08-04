import * as CompletionItemFlags from '../CompletionItemFlags/CompletionItemFlags.ts'
import * as EditorCompletionMap from '../EditorCompletionMap/EditorCompletionMap.ts'
import * as GetCompletionItemHighlights from '../GetCompletionItemHighlights/GetCompletionItemHighlights.ts'
import * as EditorCompletionType from '../EditorCompletionType/EditorCompletionType.ts'
// import * as IconTheme from '../IconTheme/IconTheme.ts'

const getLabel = (item: any) => {
  return item.label
}

const getFileIcon = (item: any) => {
  switch (item.kind) {
    case EditorCompletionType.File:
      // TODO IconTheme.getFileNameIcon(item.label)
      return ''
    case EditorCompletionType.Folder:
      // TODO IconTheme.getFolderNameIcon(item.label)
      return ''
    default:
      return ''
  }
}

export const getVisibleIem = (item: any, itemHeight: number, leadingWord: any, i: number, focusedIndex: number) => {
  return {
    label: getLabel(item),
    symbolName: EditorCompletionMap.getSymbolName(item),
    top: i * itemHeight,
    highlights: GetCompletionItemHighlights.getHighlights(item),
    focused: i === focusedIndex,
    deprecated: item.flags & CompletionItemFlags.Deprecated,
    fileIcon: getFileIcon(item),
  }
}
