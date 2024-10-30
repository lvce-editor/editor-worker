interface FindWidgetButtonsEnabled {
  readonly findButtonsEnabled: boolean
  readonly replaceButtonsEnabled: boolean
}

export const getFindWidgetButtonsEnabled = (matchCount: number, value: string): FindWidgetButtonsEnabled => {
  const findButtonsEnabled = matchCount > 0
  const replaceButtonsEnabled = value.length > 0
  return {
    findButtonsEnabled,
    replaceButtonsEnabled,
  }
}
