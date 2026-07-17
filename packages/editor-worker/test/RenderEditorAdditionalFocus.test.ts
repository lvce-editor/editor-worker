import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import * as RenderEditor from '../src/parts/RenderEditor/RenderEditor.ts'

test('renderEditor removes the previous additional focus context', async () => {
  const uid = 910_001
  const sharedState = {
    cursorInfos: [],
    focus: 12,
    focused: true,
    isSelecting: false,
    lineNumbers: false,
    selectionInfos: [],
    uid,
    widgets: [],
  }
  const oldState = {
    ...sharedState,
    additionalFocus: 9,
  }
  const newState = {
    ...sharedState,
    additionalFocus: 0,
  }
  EditorStates.set(uid, oldState as any, newState as any)

  await expect(RenderEditor.renderEditor(uid)).resolves.toEqual([['Viewlet.unsetAdditionalFocus', uid, 9]])

  EditorStates.dispose(uid)
})
