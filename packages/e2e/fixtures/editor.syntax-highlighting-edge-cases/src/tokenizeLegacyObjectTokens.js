export const TokenMap = {
  1: 'EdgeLegacyKeyword',
  2: 'EdgeLegacyText',
}

export const initialLineState = {
  state: 1,
}

export const hasArrayReturn = false

export const tokenizeLine = (line, lineState) => {
  return {
    state: lineState.state,
    tokens: [
      {
        type: 1,
        length: 6,
      },
      {
        type: 2,
        length: line.length - 6,
      },
    ],
  }
}
