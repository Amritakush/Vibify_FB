import './SongCard.css'

function SongCard({ song }) {
  return (
    <article className="song-card">
      <img
        className="song-thumb"
        src={song.thumbnail}
        alt={`${song.title} cover`}
        loading="lazy"
      />
      <h3 className="song-title" title={song.title}>{song.title}</h3>
      <p className="song-artists" title={song.artists.join(', ')}>
        {song.artists.join(', ')}
      </p>
      <span className="song-language">{song.language}</span>
    </article>
  )
}

export default SongCard