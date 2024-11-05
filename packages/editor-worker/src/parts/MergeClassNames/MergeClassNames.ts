export const mergeClassNames = (...classNames: string[]): string => {
  return classNames.filter(Boolean).join(' ')
}
