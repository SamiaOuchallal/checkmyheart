
import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>CheckMyHeart</h2>

      <nav aria-label="Navigation principale">
        <ul>
          <li>
            <NavLink to="/" end>
              Tableau de bord
            </NavLink>
          </li>

          <li>
            <NavLink to="/analysis">
              Nouvelle analyse
            </NavLink>
          </li>

          <li>
            <NavLink to="/history">
              Historique
            </NavLink>
          </li>

          <li>
            <NavLink to="/about">
              À propos
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
