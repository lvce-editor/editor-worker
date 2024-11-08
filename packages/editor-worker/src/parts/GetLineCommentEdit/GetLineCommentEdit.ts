import type { Edit } from '../Edit/Edit.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'

const RE_WHITESPACE_AT_START = /^\s+/

export const getLineCommentEdit = (rowIndex: number, line: string, lineComment: any): Edit => {
  const whitespaceMatch = line.match(RE_WHITESPACE_AT_START)
  const index = whitespaceMatch ? whitespaceMatch[0].length : 0
  if (line.slice(index).startsWith(lineComment)) {
    // TODO also check tab character
    if (line[index + lineComment.length] === ' ') {
      return {
        inserted: [''],
        deleted: [lineComment.length + 1],
        start: {
          rowIndex,
          columnIndex: index,
        },
        end: {
          rowIndex,
          columnIndex: index + lineComment.length + 1,
        },
        origin: EditOrigin.LineComment,
      }
    }
    return {
      inserted: [''],
      deleted: [lineComment],
      start: {
        rowIndex,
        columnIndex: index,
      },
      end: {
        rowIndex,
        columnIndex: index + lineComment.length,
      },
      origin: EditOrigin.LineComment,
    }
  }
  return {
    inserted: [`${lineComment} `],
    deleted: [],
    start: {
      rowIndex,
      columnIndex: index,
    },
    end: {
      rowIndex,
      columnIndex: index,
    },
    origin: EditOrigin.LineComment,
  }
}
