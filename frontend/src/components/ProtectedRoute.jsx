import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute() {
  const { user, initialized } = useSelector((state) => state.auth)
  const location = useLocation()

  // Abhi "kaun login hai" ki jaanch chal rahi hai, tab tak faisla mat karo
  if (!initialized) {
    return <p className="page-subtitle">Checking your session...</p>
  }

  // Login nahi hai: /login bhejo, aur yaad rakho ki kahan jaana tha
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute