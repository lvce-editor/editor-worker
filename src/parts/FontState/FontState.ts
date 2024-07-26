const pending = Object.create(null)
const loaded = Object.create(null)

export const setPending = (id: any, promise: any) => {
  pending[id] = promise
}

export const getPending = (id: any) => {
  return pending[id]
}

export const hasPending = (id: any) => {
  return id in pending
}

export const removePending = (id: any) => {
  delete pending[id]
}

export const setLoaded = (id: any) => {
  loaded[id] = true
}

export const isLoaded = (id: any) => {
  return loaded[id]
}
