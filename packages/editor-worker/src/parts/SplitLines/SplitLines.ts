const largeTextDetachThreshold = 1_000_000

const detachString = (value: string): string => {
  if (value.length === 0) {
    return ''
  }
  return (` ${value}`).slice(1)
}

export const splitLines = (lines: string | undefined): readonly string[] => {
  if (!lines) {
    return ['']
  }
  const split = lines.split('\n')
  if (lines.length < largeTextDetachThreshold) {
    return split
  }
  for (let i = 0; i < split.length; i++) {
    split[i] = detachString(split[i])
  }
  return split
}
