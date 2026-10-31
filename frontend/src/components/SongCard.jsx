import { useDispatch, useSelector } from 'react-redux'
import { Play, Pause } from 'lucide-react'
import { playQueue, togglePlay } from '../features/player/playerSlice'
import './SongCard.css'

// queue: is page ke saare songs, index: queue me is song ki jagah
function SongCard({ song, queue, index }) {
  const dispatch = useDispatch()
  const current = useSelector((state) => state.player.queue[state.player.index])
  const isPlaying = useSelector((state) => state.player.isPlaying)

  const isCurrent = current?.id === song.id
  const showPause = isCurrent && isPlaying

  const handleClick = () => {
    if (isCurrent) dispatch(togglePlay())
    else dispatch(playQueue({ songs: queue, index }))
  }

  return (
    <article className={`song-card${isCurrent ? ' current' : ''}`}>
      <div className="song-thumb-wrap">
        <img
          className="song-thumb"
          src={song.thumbnail}
          alt={`${song.title} cover`}
          loading="lazy"
        />
        <button
          type="button"
          className="play-btn"
          onClick={handleClick}
          aria-label={`${showPause ? 'Pause' : 'Play'} ${song.title}`}
        >
          {showPause ? <Pause size={22} aria-hidden="true" /> : <Play size={22} aria-hidden="true" />}
        </button>
      </div>

      <h3 className="song-title" title={song.title}>{song.title}</h3>
      <p className="song-artists" title={song.artists.join(', ')}>
        {song.artists.join(', ')}
      </p>
      <span className="song-language">{song.language}</span>
    </article>
  )
}

export default SongCard