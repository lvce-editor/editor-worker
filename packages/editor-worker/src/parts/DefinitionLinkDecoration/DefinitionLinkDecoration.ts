import * as DecorationType from '../DecorationType/DecorationType.ts'

const stride = 4

const isDefinitionLink = (decorations: readonly number[], index: number): boolean => {
  return decorations[index + 2] === DecorationType.DefinitionLink
}

export const matches = (editor: any, offset: number, length: number): boolean => {
  const { decorations } = editor
  for (let i = 0; i < decorations.length; i += stride) {
    if (isDefinitionLink(decorations, i)) {
      return decorations[i] === offset && decorations[i + 1] === length
    }
  }
  return false
}

export const clear = (editor: any): any => {
  const { decorations } = editor
  const filtered: number[] = []
  for (let i = 0; i < decorations.length; i += stride) {
    if (!isDefinitionLink(decorations, i)) {
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

export const set = (editor: any, offset: number, length: number): any => {
  if (matches(editor, offset, length)) {
    return editor
  }
  const editorWithoutDefinitionLink = clear(editor)
  return {
    ...editorWithoutDefinitionLink,
    decorations: [...editorWithoutDefinitionLink.decorations, offset, length, DecorationType.DefinitionLink, 0],
  }
}
