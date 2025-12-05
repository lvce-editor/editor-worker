import type { Edit } from '../Edit/Edit.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'

const RE_WHITESPACE_AT_START = /^\s+/

export const getLineCommentEdit = (rowIndex: number, line: string, lineComment: string): Edit => {
  const whitespaceMatch = line.match(RE_WHITESPACE_AT_START)
  const index = whitespaceMatch ? whitespaceMatch[0].length : 0
  if (line.slice(index).startsWith(lineComment)) {
    // TODO also check tab character
    if (line[index + lineComment.length] === ' ') {
      return {
        deleted: [lineComment + ' '],
        end: {
          columnIndex: index + lineComment.length + 1,
          rowIndex,
        },
        inserted: [''],
        origin: EditOrigin.LineComment,
        start: {
          columnIndex: index,
          rowIndex,
        },
      }
    }
    return {
      deleted: [lineComment],
      end: {
        columnIndex: index + lineComment.length,
        rowIndex,
      },
      inserted: [''],
      origin: EditOrigin.LineComment,
      start: {
        columnIndex: index,
        rowIndex,
      },
    }
  }
  return {
    deleted: [],
    end: {
      columnIndex: index,
      rowIndex,
    },
    inserted: [`${lineComment} `],
    origin: EditOrigin.LineComment,
    start: {
      columnIndex: index,
      rowIndex,
    },
  }
}
