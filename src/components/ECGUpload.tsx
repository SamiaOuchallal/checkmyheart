
import { useState } from 'react'
import type { ChangeEvent } from 'react'

const MAX_FILE_SIZE = 5 * 1024 * 1024

function ECGUpload() {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [error, setError] = useState('')

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    setError('')
    setSelectedFile(null)

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

    setSelectedFile(file)
  }

  function removeFile() {
    setSelectedFile(null)
    setError('')
  }

  return (
    <div className="ecg-upload">
      <h2>Importer un ECG</h2>

      <p>
        Sélectionnez un fichier CSV contenant
        un signal électrocardiographique.
      </p>

      <div className="upload-zone">
        <label htmlFor="ecg-file">
          Choisir un fichier ECG
        </label>

        <input
          id="ecg-file"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
        />

        <p>Format accepté : CSV</p>
        <p>Taille maximale : 5 Mo</p>
      </div>

      {error && (
        <p className="upload-error" role="alert">
          {error}
        </p>
      )}

      {selectedFile && (
        <div className="selected-file">
          <p>
            <strong>Fichier :</strong>{' '}
            {selectedFile.name}
          </p>

          <p>
            <strong>Taille :</strong>{' '}
            {(selectedFile.size / 1024).toFixed(2)} Ko
          </p>

          <button
            type="button"
            onClick={removeFile}
          >
            Supprimer le fichier
          </button>
        </div>
      )}
    </div>
  )
}

export default ECGUpload
