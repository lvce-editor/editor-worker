// @ts-ignore
import * as Editor from '../Editor/Editor.ts'

// @ts-ignore
const getSelectDownChanges = (lines, selections) => {
  const max = lines.length - 1
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    newSelections[i] = selections[i]
    newSelections[i + 1] = selections[i + 1]
    newSelections[i + 2] = Math.min(selections[i + 2] + 1, max)
    newSelections[i + 3] = selections[i + 3]
  }
  return newSelections
}

// @ts-ignore
export const selectDown = (editor) => {
  const { lines, selections } = editor
  const newSelections = getSelectDownChanges(lines, selections)
  return Editor.scheduleSelections(editor, newSelections)
}
