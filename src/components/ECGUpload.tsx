
import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import type { ECGPoint } from '../types/ecg'
import { parseECG } from '../utils/parseECG'
import ECGChart from './ECGChart'

const MAX_FILE_SIZE = 5 * 1024 * 1024

function ECGUpload() {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [ecgData, setEcgData] =
    useState<ECGPoint[]>([])

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    setSelectedFile(null)
    setEcgData([])
    setError('')

    if (!file) {
      return
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Veuillez sélectionner un fichier CSV.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Le fichier ne doit pas dépasser 5 Mo.')
      event.target.value = ''
      return
    }

    setIsLoading(true)

    try {
      const content = await file.text()
      const points = parseECG(content)

      setSelectedFile(file)
      setEcgData(points)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Erreur lors de la lecture du fichier.'

      setError(message)
      event.target.value = ''
    } finally {
      setIsLoading(false)
    }
  }

  function removeFile() {
    setSelectedFile(null)
    setEcgData([])
    setError('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="ecg-upload">
      <h2>Importer un ECG</h2>

      <p>
        Sélectionnez un fichier CSV contenant
        les colonnes time et ecg.
      </p>

      <div className="upload-zone">
        <label htmlFor="ecg-file">
          Choisir un fichier ECG
        </label>

        <input
          ref={fileInputRef}
          id="ecg-file"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        <p>Format accepté : CSV</p>
        <p>Taille maximale : 5 Mo</p>
      </div>

      {isLoading && <p>Lecture du fichier en cours...</p>}

      {error && (
        <p className="upload-error" role="alert">
          {error}
        </p>
      )}

      {selectedFile && (
        <div className="selected-file">
          <h3>Fichier importé</h3>

          <p>
            <strong>Nom :</strong> {selectedFile.name}
          </p>

          <p>
            <strong>Taille :</strong>{' '}
            {(selectedFile.size / 1024).toFixed(2)} Ko
          </p>

          <p>
            <strong>Nombre de points :</strong>{' '}
            {ecgData.length}
          </p>

          <button type="button" onClick={removeFile}>
            Supprimer le fichier
          </button>
        </div>
      )}

      {ecgData.length > 0 && (
        <div className="ecg-preview">
          <h3>Aperçu des données ECG</h3>

          <table>
            <thead>
              <tr>
                <th>Temps (s)</th>
                <th>Amplitude</th>
              </tr>
            </thead>

            <tbody>
              {ecgData.slice(0, 10).map((point, index) => (
                <tr key={index}>
                  <td>{point.time}</td>
                  <td>{point.ecg}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>
            Affichage des 10 premiers points maximum.
          </p>
        </div>
      )}
      {ecgData.length > 0 && (<ECGChart data={ecgData} />)}
    </div>
  )
}

export default ECGUpload
