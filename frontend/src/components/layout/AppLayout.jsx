import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import './AppLayout.css'

function AppLayout() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout