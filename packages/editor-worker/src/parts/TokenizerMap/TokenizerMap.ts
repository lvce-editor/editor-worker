import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.ts'

const tokenizers = Object.create(null)

export const set = (id: any, value: any) => {
  tokenizers[id] = value
}

export const get = (id: any) => {
  return tokenizers[id] || TokenizePlainText
}

const tokenizerIds = new WeakMap<object, number>()
const state = { nextId: 1 }

export const register = (tokenizer: object): number => {
  const existingId = tokenizerIds.get(tokenizer)
  if (existingId !== undefined && tokenizers[existingId] === tokenizer) {
    return existingId
  }
  let { nextId } = state
  while (nextId in tokenizers) {
    nextId++
  }
  const id = nextId
  state.nextId = nextId + 1
  tokenizers[id] = tokenizer
  tokenizerIds.set(tokenizer, id)
  return id
}
