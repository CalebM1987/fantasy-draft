export function saveToStorage(key: string, obj: any) {
  if (localStorage){
    localStorage.setItem(key, JSON.stringify(obj))
  }
}

/**
 * load an item from local storage
 * @param key - the local storage lookup key
 * @param def - an optional default value if nothing is retrieved from local storage
 * @returns 
 */
export function loadFromStorage<T>(key: string, def?: T): T | undefined {
  if (localStorage){
    const item = localStorage.getItem(key)
    if (item){
      return JSON.parse(item) as T
    }
  }
  return def
}