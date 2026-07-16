import * as DecorationType from '../DecorationType/DecorationType.ts'

const stride = 4

const isDecorationType = (decorations: readonly number[], index: number, type: number): boolean => {
  return decorations[index + 2] === type
}

const matchesType = (editor: any, offset: number, length: number, type: number): boolean => {
  const { decorations } = editor
  for (let i = 0; i < decorations.length; i += stride) {
    if (isDecorationType(decorations, i, type)) {
      return decorations[i] === offset && decorations[i + 1] === length
    }
  }
  return false
}

const clearType = (editor: any, type: number): any => {
  const { decorations } = editor
  const filtered: number[] = []
  for (let i = 0; i < decorations.length; i += stride) {
    if (!isDecorationType(decorations, i, type)) {
      filtered.push(decorations[i], decorations[i + 1], decorations[i + 2], decorations[i + 3])
    }
  }
  if (filtered.length === decorations.length) {
    return editor
  }
  return {
    ...editor,
    decorations: filtered,
  }
}

const setType = (editor: any, offset: number, length: number, type: number): any => {
  if (matchesType(editor, offset, length, type)) {
    return editor
  }
  const editorWithoutDecoration = clearType(editor, type)
  return {
    ...editorWithoutDecoration,
    decorations: [...editorWithoutDecoration.decorations, offset, length, type, 0],
  }
}

export const matches = (editor: any, offset: number, length: number): boolean => {
  return matchesType(editor, offset, length, DecorationType.DefinitionLink)
}

export const clear = (editor: any): any => {
  return clearType(editor, DecorationType.DefinitionLink)
}

export const set = (editor: any, offset: number, length: number): any => {
  return setType(editor, offset, length, DecorationType.DefinitionLink)
}

export const clearRename = (editor: any): any => {
  return clearType(editor, DecorationType.Rename)
}

export const setRename = (editor: any, offset: number, length: number): any => {
  return setType(editor, offset, length, DecorationType.Rename)
}
