import 'whatwg-fetch'

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json() as T
  } else {
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch (e) {
      return text as any
    }
  }
}