import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import * as RenderEditor from '../src/parts/RenderEditor/RenderEditor.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

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

test('renderEditor marks selections as unfocused when the editor loses focus', async () => {
  const uid = 910_003
  const sharedState = {
    additionalFocus: 0,
    cursorInfos: [],
    focus: 12,
    lineNumbers: false,
    selectionInfos: [1, 2, 3, 4],
    uid,
    widgets: [],
  }
  const oldState = {
    ...sharedState,
    focused: true,
  }
  const newState = {
    ...sharedState,
    focused: false,
  }
  EditorStates.set(uid, oldState as any, newState as any)

  try {
    await expect(RenderEditor.renderEditor(uid)).resolves.toEqual([
      [
        'setSelections',
        [],
        [
          {
            childCount: 0,
            className: 'EditorSelection SelectionUnfocused',
            height: 4,
            left: 1,
            top: 2,
            type: VirtualDomElements.Div,
            width: 3,
          },
        ],
      ],
    ])
  } finally {
    EditorStates.dispose(uid)
  }
})
