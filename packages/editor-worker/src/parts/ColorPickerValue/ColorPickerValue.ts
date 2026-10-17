const javascriptHexColorPattern = /^0x([\da-f]{6})$/i

export const toColorPickerValue = (value: string): string => {
  const match = javascriptHexColorPattern.exec(value)
  if (!match) {
    return value
  }
  return `#${match[1]}`
}

export const toEditorValue = (value: string, originalValue: string): string => {
  if (!javascriptHexColorPattern.test(originalValue)) {
    return value
  }
  const match = /^#([\da-f]{6})$/i.exec(value)
  if (!match) {
    return value
  }
  return `0x${match[1]}`
}
