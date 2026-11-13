import type { ECGPoint } from '../types/ecg'

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

export interface ECGAnalysisResult {
  point_count: number
  duration: number
  min_amplitude: number
  max_amplitude: number
  mean_amplitude: number
}

export async function analyzeECG(
  points: ECGPoint[]
): Promise<ECGAnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/api/ecg/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ points }),
  })

  if (!response.ok) {
    throw new Error(`Erreur pendant l'analyse ECG (${response.status})`)
  }

  const result: ECGAnalysisResult = await response.json()

  return result
}


export interface ECGFilterResult {
  point_count: number
  filtered_points: ECGPoint[]
}

export async function filterECG(
  points: ECGPoint[]
): Promise<ECGFilterResult> {
  const response = await fetch(`${API_BASE_URL}/api/ecg/filter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ points }),
  })

  if (!response.ok) {
    let message = `Erreur de filtrage (${response.status})`

    try {
      const errorData = await response.json()

      if (typeof errorData.detail === 'string') {
        message = errorData.detail
      }
    } catch {
      // Conserver le message générique
    }

    throw new Error(message)
  }

  return (await response.json()) as ECGFilterResult
}
