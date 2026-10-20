import * as GetFormattingEdits from '../GetFormattingEdits/GetFormattingEdits.ts'
import * as IsFormattingError from '../IsFormattingError/IsFormattingError.ts'
import * as ApplyDocumentEdits from './EditorCommandApplyDocumentEdits.ts'
import * as EditorShowMessage from './EditorCommandShowMessage.ts'

const expectedErrorMessage = 'Failed to execute formatting provider: FormattingError:'

export const getFormattingEdits = async (editor: any) => {
  try {
    return await GetFormattingEdits.getFormattingEdits(editor)
  } catch (error) {
    if (IsFormattingError.isFormattingError(error)) {
      console.error(
        'Formatting Error:',
        // @ts-ignore
        error.message.slice(expectedErrorMessage.length),
      )
      return undefined
    }
    console.error(error)

    // TODO configure editor message as widget
    const displayErrorMessage = String(error)
    await EditorShowMessage.editorShowMessage(editor, 0, 0, displayErrorMessage, true)
    return undefined
  }
}

// TODO also format with cursor
export const format = async (editor: any) => {
  const edits = await getFormattingEdits(editor)
  if (!edits) {
    return editor
  }
  return ApplyDocumentEdits.applyDocumentEdits(editor, edits)
}
