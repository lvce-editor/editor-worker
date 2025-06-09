import * as DebugWorker from '../DebugWorker/DebugWorker.ts'

export const setDebugEnabled = (editor: any, enabled: boolean): any => {
  return {
    ...editor,
    debugEnabled: enabled,
  }
}

export const getHighlightedLine = async (editor: any): Promise<number> => {
  if (!editor.debugEnabled) {
    return -1
  }
  try {
    return await DebugWorker.invoke('Debug.getHighlightedLine', editor.uid)
  } catch (error) {
    console.error('Failed to get highlighted line:', error)
    return -1
  }
}
