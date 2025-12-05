import * as CompletionItemFlags from '../CompletionItemFlags/CompletionItemFlags.ts'
import * as EditorCompletionMap from '../EditorCompletionMap/EditorCompletionMap.ts'
import * as GetCompletionFileIcon from '../GetCompletionFileIcon/GetCompletionFileIcon.ts'
import * as GetCompletionItemHighlights from '../GetCompletionItemHighlights/GetCompletionItemHighlights.ts'

const getLabel = (item: any) => {
  return item.label
}

export const getVisibleIem = (item: any, itemHeight: number, leadingWord: any, i: number, focusedIndex: number) => {
  return {
    deprecated: item.flags & CompletionItemFlags.Deprecated,
    fileIcon: GetCompletionFileIcon.getCompletionFileIcon(item.kind),
    focused: i === focusedIndex,
    highlights: GetCompletionItemHighlights.getHighlights(item),
    label: getLabel(item),
    symbolName: EditorCompletionMap.getSymbolName(item.kind),
    top: i * itemHeight,
  }
}
