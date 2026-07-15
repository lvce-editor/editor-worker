import * as Assert from '../Assert/Assert.ts'
import * as Definition from '../Definition/Definition.ts'
import * as DefinitionLinkDecoration from '../DefinitionLinkDecoration/DefinitionLinkDecoration.ts'
import * as GetWordMatchAtPosition from '../GetWordMatchAtPosition/GetWordMatchAtPosition.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

const isNoDefinitionProviderFoundError = (error: unknown): boolean => {
  return error instanceof Error && error.message.startsWith('Failed to execute definition provider: No definition provider found')
}

// @ts-ignore
export const handleMouseMoveWithAltKey = async (editor, x, y) => {
  Assert.object(editor)
  Assert.number(x)
  Assert.number(y)
  const position = await EditorPosition.at(editor, x, y)
  const wordMatch = GetWordMatchAtPosition.getWordMatchAtPosition(editor.lines, position.rowIndex, position.columnIndex)
  if (!wordMatch.word) {
    return DefinitionLinkDecoration.clear(editor)
  }
  const wordOffset = TextDocument.offsetAt(editor, position.rowIndex, wordMatch.start)
  const wordLength = wordMatch.end - wordMatch.start
  if (DefinitionLinkDecoration.matches(editor, wordOffset, wordLength)) {
    return editor
  }
  const documentOffset = TextDocument.offsetAt(editor, position.rowIndex, position.columnIndex)
  try {
    const definition = await Definition.getDefinition(editor, documentOffset)
    if (!definition) {
      return DefinitionLinkDecoration.clear(editor)
    }
    return DefinitionLinkDecoration.set(editor, wordOffset, wordLength)
  } catch (error) {
    if (isNoDefinitionProviderFoundError(error)) {
      return DefinitionLinkDecoration.clear(editor)
    }
    throw error
  }
}
