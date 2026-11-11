
import ECGUpload from '../components/ECGUpload'

function NewAnalysis() {
  return (
    <section className="new-analysis">
      <h1>Nouvelle analyse ECG</h1>

      <p>
        Importez un électrocardiogramme
        pour commencer son traitement.
      </p>

      <ECGUpload />
    </section>
  )
}

export default NewAnalysis
