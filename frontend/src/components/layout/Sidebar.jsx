import { NavLink } from 'react-router-dom'
import { House, Compass, Search, Heart, ListMusic, Music } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/browse', label: 'Browse', icon: Compass },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/liked', label: 'Liked Songs', icon: Heart },
  { to: '/playlists', label: 'Playlists', icon: ListMusic },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <Music aria-hidden="true" size={28} />
        <span className="brand-text">Vibify</span>
      </NavLink>

      <nav className="nav" aria-label="Main">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <Icon aria-hidden="true" size={22} />
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar