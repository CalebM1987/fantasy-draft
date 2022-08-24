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

interface ProxiedResponse {
  contents: string;
  status: {
    url: string;
    content_type: string;
    content_length: number;
    http_code: number;
    respponse_time: number;
  }
}

export async function proxiedFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const proxy = `https://api.allorigins.win/get?url=${url}`
  try {
    const resp = await fetchJson<ProxiedResponse>(proxy, init)
    return JSON.parse(resp.contents) as T
  } catch(err){
    throw err
  }

}