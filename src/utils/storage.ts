export function saveToStorage(key: string, obj: any) {
  if (localStorage){
    localStorage.setItem(key, JSON.stringify(obj))
  }
}

export function loadFromStorage<T>(key: string): T | undefined {
  if (localStorage){
    const item = localStorage.getItem(key)
    if (item){
      return JSON.parse(item) as T
    }
  }
  return 
}