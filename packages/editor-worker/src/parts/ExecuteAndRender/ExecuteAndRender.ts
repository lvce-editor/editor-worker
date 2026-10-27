import * as EditorStates from '../EditorStates/EditorStates.ts'
import { renderDirect2 } from '../RenderDirect2/RenderDirect2.ts'

export const executeAndRender = async (
  command: (uid: number, ...args: readonly any[]) => Promise<unknown>,
  uid: number,
  args: readonly any[],
): Promise<readonly any[]> => {
  const editor = EditorStates.get(uid)?.newState
  if (!editor) return []
  // The wrapped command releases the document queue before rendering starts.
  await command(uid, ...args)
  const current = EditorStates.get(uid)?.newState
  if (!current || editor.lifecycle?.disposed || current.lifecycle !== editor.lifecycle) return []
  return renderDirect2(uid)
}
