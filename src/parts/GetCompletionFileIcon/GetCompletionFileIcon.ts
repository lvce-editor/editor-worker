import * as EditorCompletionType from '../EditorCompletionType/EditorCompletionType.ts'
import * as Character from '../Character/Character.ts'

// TODO
export const getCompletionFileIcon = (kind: number) => {
  switch (kind) {
    case EditorCompletionType.File:
      return Character.EmptyString
    case EditorCompletionType.Folder:
      return Character.EmptyString
    default:
      return Character.EmptyString
  }
}
