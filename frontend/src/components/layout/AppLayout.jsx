import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from './Sidebar'
import PlayerBar from '../../features/player/PlayerBar'
import './AppLayout.css'

function AppLayout() {
  // Song chunte hi page ke neeche jagah chhodni hai, taaki player content ko na dhake
  const hasPlayer = useSelector((state) => state.player.index >= 0)

  return (
    <div className={`app${hasPlayer ? ' has-player' : ''}`}>
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
      <PlayerBar />
    </div>
  )
}

export default AppLayout