import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.ts'
import * as GetOffsetAtCursor from '../GetOffsetAtCursor/GetOffsetAtCursor.ts'

// TODO possible to do this with events/state machine instead of promises -> enables canceling operations / concurrent calls
export const getCompletions = async (editor: any) => {
  const offset = GetOffsetAtCursor.getOffsetAtCursor(editor)
  const completions = await ExtensionHostCompletion.executeCompletionProvider(editor, offset)
  return completions
}

// TODO don't send unnecessary parts of completion item like matches
export const resolveCompletion = async (editor: any, name: string, completionItem: any) => {
  try {
    Assert.object(editor)
    Assert.string(name)
    Assert.object(completionItem)
    const offset = GetOffsetAtCursor.getOffsetAtCursor(editor)
    // @ts-ignore
    const resolvedCompletionItem = await ExtensionHostCompletion.executeResolveCompletionItem(editor, offset, name, completionItem)
    return resolvedCompletionItem
  } catch {
    return undefined
  }
}
