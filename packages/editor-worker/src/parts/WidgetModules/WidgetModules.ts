const modules = Object.create(null)

export const register = (id: string, value: any) => {
  modules[id] = value
}

export const get = (id: string) => {
  return modules[id]
}
