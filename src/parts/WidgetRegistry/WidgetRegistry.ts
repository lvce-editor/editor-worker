const map = Object.create(null)

export const set = (id: string, widget: any) => {
  map[id] = widget
}

export const get = (id: string) => {
  return map[id]
}
