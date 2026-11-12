
const API_BASE_URL = 'http://127.0.0.1:8000'

export interface ApiStatus {
  status: string
  service: string
}

export async function getApiStatus(): Promise<ApiStatus> {
  const response = await fetch(`${API_BASE_URL}/api/status`)

  if (!response.ok) {
    throw new Error('Impossible de contacter le backend')
  }

  const data: ApiStatus = await response.json()

  return data
}
