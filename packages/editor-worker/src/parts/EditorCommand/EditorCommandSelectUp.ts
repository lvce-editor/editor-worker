// @ts-ignore
import * as Editor from '../Editor/Editor.ts'

// @ts-ignore
const getSelectUpChanges = (selections) => {
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    newSelections[i] = selections[i]
    newSelections[i + 1] = selections[i + 1]
    newSelections[i + 2] = Math.max(selections[i + 2] - 1, 0)
    newSelections[i + 3] = selections[i + 3]
  }
  return newSelections
}

// @ts-ignore
export const selectUp = (editor) => {
  const { selections } = editor
  const newSelections = getSelectUpChanges(selections)
  return Editor.scheduleSelections(editor, newSelections)
}
