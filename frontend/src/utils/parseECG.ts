
import type { ECGPoint } from '../types/ecg'

export function parseECG(csvContent: string): ECGPoint[] {
  const lines = csvContent.trim().split(/\r?\n/)

  if (lines.length < 2) {
    throw new Error('Le fichier CSV est vide ou incomplet.')
  }

  const header = lines[0].trim().toLowerCase()

  if (header !== 'time,ecg') {
    throw new Error(
      'Le fichier doit contenir les colonnes time,ecg.'
    )
  }

  const points: ECGPoint[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')

    if (values.length !== 2) {
      throw new Error(
        `Format incorrect: ligne ${i + 1}.`
      )
    }

    const timeText = values[0].trim()
    const ecgText = values[1].trim()

    if (timeText === '' || ecgText === '') {
      throw new Error(
        `Valeur manquante: ligne ${i + 1}.`
      )
    }

    const time = Number(timeText)
    const ecg = Number(ecgText)

    if (!Number.isFinite(time) || !Number.isFinite(ecg)) {
      throw new Error(
        `Valeur non numérique: ligne ${i + 1}.`
      )
    }

    if (
      points.length > 0 &&
      time <= points[points.length - 1].time
    ) {
      throw new Error(
        `Le temps doit être croissant: ligne ${i + 1}.`
      )
    }

    points.push({ time, ecg })
  }

  return points
}
