import * as Editor from '../Editor/Editor.ts'
import { close } from '../EditorCompletionWidget/EditorCompletionWidget.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import { isWhitespace } from '../IsWhitespace/IsWhitespace.ts'
import { openCompletion } from './EditorCommandOpenCompletion.ts'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.ts'

export const type = async (editor: any, text: string) => {
  const changes = editorReplaceSelections(editor, [text], EditOrigin.EditorType)
  const newEditor = await Editor.scheduleDocumentAndCursorsSelections(editor, changes)

  if (newEditor.completionsOnType) {
    // TODO race condtion, completions might still be in loading state while this runs
    if (isWhitespace(text)) {
      // TODO only close if it was open
      const withoutCompletion = await close(newEditor)
      return withoutCompletion
    }
    // TODO if completion widget is already visible, advance
    // TODO if character typed is space or tab or separator, close completions
    const withCompletion = await openCompletion(newEditor)
    return withCompletion
  }
  return newEditor
}
