
import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import type { ECGPoint } from '../types/ecg'
import { parseECG } from '../utils/parseECG'
import ECGChart from './ECGChart'

import { analyzeECG } from '../services/api'
import type { ECGAnalysisResult } from '../services/api'
import ECGAnalysisResults from './ECGAnalysisResults'

import {filterECG} from '../services/api'

const MAX_FILE_SIZE = 5 * 1024 * 1024

function ECGUpload() {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [ecgData, setEcgData] =
    useState<ECGPoint[]>([])

  const [analysisResult, setAnalysisResult] =
  useState<ECGAnalysisResult | null>(null)

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [filteredData, setFilteredData] = useState<ECGPoint[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [filterError, setFilterError] = useState<string | null>(null)

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    setAnalysisResult(null)
    setAnalysisError(null)
    setFilteredData([])
    setFilterError(null)

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

    setAnalysisResult(null)
    setAnalysisError(null)
    setFilteredData([])
    setFilterError(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }


async function handleAnalyze() {
  if (ecgData.length < 2 || isAnalyzing) {
    return
  }

  setIsAnalyzing(true)
  setAnalysisError(null)
  setAnalysisResult(null)

  try {
    const result = await analyzeECG(ecgData)
    setAnalysisResult(result)
  } catch {
    setAnalysisError(
      "L'analyse a échoué. Vérifie que le backend est démarré."
    )
  } finally {
    setIsAnalyzing(false)
  }
}



async function handleFilter() {
  if (ecgData.length < 20 || isFiltering) {
    return
  }

  setIsFiltering(true)
  setFilterError(null)
  setFilteredData([])

  try {
    const result = await filterECG(ecgData)
    setFilteredData(result.filtered_points)
  } catch (error) {
    setFilterError(
      error instanceof Error
        ? error.message
        : "Une erreur est survenue pendant le filtrage."
    )
  } finally {
    setIsFiltering(false)
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
      {ecgData.length > 0 && (<ECGChart data={ecgData} filteredData={filteredData} />)}


{ecgData.length >= 20 && (
  <div className="ecg-analysis-actions">
    <button
      type="button"
      onClick={handleFilter}
      disabled={isFiltering}
    >
      {isFiltering ? 'Filtrage en cours...' : 'Filtrer le signal'}
    </button>
  </div>
)}

{filterError && (
  <p role="alert" className="ecg-analysis-error">
    {filterError}
  </p>
)}


      {ecgData.length >= 2 && (
  <div className="ecg-analysis-actions">
    <button
      type="button"
      onClick={handleAnalyze}
      disabled={isAnalyzing}
    >
      {isAnalyzing ? 'Analyse en cours...' : 'Analyser le signal'}
    </button>
  </div>
)}

{analysisError && (
  <p role="alert" className="ecg-analysis-error">
    {analysisError}
  </p>
)}

{analysisResult && (
  <ECGAnalysisResults result={analysisResult} />
)}
    </div>
  )
}

export default ECGUpload
