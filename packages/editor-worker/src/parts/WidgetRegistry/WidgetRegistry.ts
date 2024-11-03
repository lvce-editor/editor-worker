const map = Object.create(null)

export const set = (id: number, widget: any) => {
  map[id] = widget
}

export const get = (id: number) => {
  return map[id]
}
