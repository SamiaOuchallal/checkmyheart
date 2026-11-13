
import type { ECGAnalysisResult } from '../services/api'

interface ECGAnalysisResultsProps {
  result: ECGAnalysisResult
}

function ECGAnalysisResults({ result }: ECGAnalysisResultsProps) {
  return (
    <section className="ecg-results">
      <h3>Résultats de l'analyse ECG</h3>

      <div className="ecg-results__grid">
        <div className="ecg-results__card">
          <span>Nombre de points</span>
          <strong>{result.point_count}</strong>
        </div>

        <div className="ecg-results__card">
          <span>Durée du signal</span>
          <strong>{result.duration.toFixed(3)} s</strong>
        </div>

        <div className="ecg-results__card">
          <span>Amplitude minimale</span>
          <strong>{result.min_amplitude.toFixed(3)}</strong>
        </div>

        <div className="ecg-results__card">
          <span>Amplitude maximale</span>
          <strong>{result.max_amplitude.toFixed(3)}</strong>
        </div>

        <div className="ecg-results__card">
          <span>Amplitude moyenne</span>
          <strong>{result.mean_amplitude.toFixed(3)}</strong>
        </div>
      </div>

      <p className="ecg-results__notice">
        Résultats expérimentaux.
        Ils ne constituent pas un diagnostic médical.
      </p>
    </section>
  )
}

export default ECGAnalysisResults
