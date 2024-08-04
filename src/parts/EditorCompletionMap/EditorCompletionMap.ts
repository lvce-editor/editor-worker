import * as EditorCompletionType from '../EditorCompletionType/EditorCompletionType.ts'
import * as SymbolName from '../SymbolName/SymbolName.ts'

export const getSymbolName = (item: any) => {
  switch (item.kind) {
    case EditorCompletionType.Property:
      return SymbolName.SymbolProperty
    case EditorCompletionType.Value:
      return SymbolName.SymbolValue
    case EditorCompletionType.Function:
      return SymbolName.SymbolFunction
    case EditorCompletionType.Variable:
      return SymbolName.SymbolVariable
    case EditorCompletionType.Keyword:
      return SymbolName.SymbolKeyword
    case EditorCompletionType.Field:
      return SymbolName.SymbolField
    case EditorCompletionType.File:
      return SymbolName.SymbolNone
    default:
      return SymbolName.SymbolDefault
  }
}
