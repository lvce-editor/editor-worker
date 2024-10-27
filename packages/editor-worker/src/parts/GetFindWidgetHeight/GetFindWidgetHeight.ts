export const getFindWidgetHeight = (replaceExpanded: boolean) => {
  const collapsedHeight = 30
  const expandedHeight = 60
  const newHeight = replaceExpanded ? expandedHeight : collapsedHeight
  return newHeight
}
