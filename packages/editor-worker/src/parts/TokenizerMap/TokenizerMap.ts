import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.ts'

const tokenizers: any[] = [TokenizePlainText]

export const set = (id: any, value: any) => {
  tokenizers[id] = value
}

export const get = (id: any) => {
  return tokenizers[id] || TokenizePlainText
}

export const register = (tokenizer: object): number => {
  const existingId = tokenizers.indexOf(tokenizer)
  if (existingId !== -1) {
    return existingId
  }
  tokenizers.push(tokenizer)
  return tokenizers.length - 1
}
