const RE_ALPHA_NUMERIC = /[a-zA-Z\d]/

export const isAlphaNumeric = (char: string) => {
  return RE_ALPHA_NUMERIC.test(char)
}
