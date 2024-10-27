import * as TabCompletion from '../TabCompletion/TabCompletion.ts'

export const handleTab = async (editor: any) => {
  // TODO
  // 1. if completion is open, insert completion item
  // 2. try to execute tab completion provider
  // 3. enter tab or two spaces
  const result = await TabCompletion.getTabCompletion(editor)
  console.log({ result })
  return editor
}
