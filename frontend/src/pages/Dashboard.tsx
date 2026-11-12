import BackendStatus from '../components/BackendStatus'

function Dashboard() {
  return (
    <section className="dashboard">
      <h1>Tableau de bord</h1>

      <BackendStatus />

      <p>
        Bienvenue sur CheckMyHeart,
        votre application d'analyse ECG.
      </p>

      <div className="dashboard-card">
        <h3>Nouvelle analyse ECG</h3>

        <p>
          Importez un électrocardiogramme
          pour visualiser son signal.
        </p>

      </div>
    </section>
  )
}

export default Dashboard
