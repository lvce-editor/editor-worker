import * as GetFormattingEdits from '../GetFormattingEdits/GetFormattingEdits.ts'
import * as IsFormattingError from '../IsFormattingError/IsFormattingError.ts'
import * as ApplyDocumentEdits from './EditorCommandApplyDocumentEdits.ts'
import * as EditorShowMessage from './EditorCommandShowMessage.ts'

const expectedErrorMessage = 'Failed to execute formatting provider: FormattingError:'

// TODO also format with cursor
export const format = async (editor: any) => {
  try {
    const edits = await GetFormattingEdits.getFormattingEdits(editor)
    return ApplyDocumentEdits.applyDocumentEdits(editor, edits)
  } catch (error) {
    if (IsFormattingError.isFormattingError(error)) {
      console.error(
        'Formatting Error:',
        // @ts-ignore
        error.message.slice(expectedErrorMessage.length),
      )
      return editor
    }
    console.error(error)

    // TODO configure editor message as widget
    const displayErrorMessage = `${error}`
    await EditorShowMessage.editorShowMessage(editor, 0, 0, displayErrorMessage, true)
    return editor
  }
}
