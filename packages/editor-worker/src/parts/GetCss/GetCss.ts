export const getCss = (itemHeight: number): string => {
  return `:root {
  --ActivityBarItemHeight: var(--${itemHeight}px);
}
`
}
