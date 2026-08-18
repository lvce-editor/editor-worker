import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import * as RenderEditor from '../src/parts/RenderEditor/RenderEditor.ts'

test('renderEditor focuses the editor when pointer selection starts', async () => {
  const uid = 910_002
  const sharedState = {
    additionalFocus: 0,
    cursorInfos: [],
    focus: 12,
    focused: true,
    lineNumbers: false,
    selectionInfos: [],
    uid,
    widgets: [],
  }
  const oldState = {
    ...sharedState,
    isSelecting: false,
  }
  const newState = {
    ...sharedState,
    isSelecting: true,
  }
  EditorStates.set(uid, oldState as any, newState as any)

  try {
    await expect(RenderEditor.renderEditor(uid)).resolves.toEqual([['setFocused', true]])
  } finally {
    EditorStates.dispose(uid)
  }
})
