import * as TabCompletion from '../TabCompletion/TabCompletion.ts'

export const handleTab = async (editor: any) => {
  const result = await TabCompletion.getTabCompletion(editor)
  if (!result) {
    // TODO enter tab or two spaces
    return editor
  }

  // TODO apply tab completion
  console.log({ result })
  return editor
}
