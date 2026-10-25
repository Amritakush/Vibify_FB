import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { House, Compass, Search, Heart, ListMusic, Music, LogIn, LogOut } from 'lucide-react'
import { logoutUser } from '../../features/auth/authSlice'

const links = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/browse', label: 'Browse', icon: Compass },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/liked', label: 'Liked Songs', icon: Heart },
  { to: '/playlists', label: 'Playlists', icon: ListMusic },
]

function Sidebar() {
  const dispatch = useDispatch()
  const { user, initialized } = useSelector((state) => state.auth)

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

      {/* Jaanch poori hone se pehle kuch mat dikhao, warna "Log in" pal bhar ko chamakta hai */}
      {initialized && (
        <div className="sidebar-footer">
          {user ? (
            <>
              <p className="user-name" title={user.email}>{user.name}</p>
              <button
                type="button"
                className="nav-link"
                onClick={() => dispatch(logoutUser())}
              >
                <LogOut aria-hidden="true" size={22} />
                <span className="nav-label">Log out</span>
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-link">
              <LogIn aria-hidden="true" size={22} />
              <span className="nav-label">Log in</span>
            </NavLink>
          )}
        </div>
      )}
    </aside>
  )
}

export default Sidebar