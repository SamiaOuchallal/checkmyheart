
import { useEffect, useState } from 'react'
import { getApiStatus } from '../services/api'

type ConnectionStatus = 'loading' | 'online' | 'offline'

function BackendStatus() {
  const [status, setStatus] = useState<ConnectionStatus>('loading')

  useEffect(() => {
    let active = true

    async function checkConnection() {
      try {
        const data = await getApiStatus()

        if (active) {
          setStatus(data.status === 'online' ? 'online' : 'offline')
        }
      } catch {
        if (active) {
          setStatus('offline')
        }
      }
    }

    checkConnection()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className={`backend-status backend-status--${status}`}>
      <span className="backend-status__dot" aria-hidden="true" />

      {status === 'loading' && <span>Connexion au backend...</span>}
      {status === 'online' && <span>Backend connecté</span>}
      {status === 'offline' && <span>Backend indisponible</span>}
    </div>
  )
}

export default BackendStatus
