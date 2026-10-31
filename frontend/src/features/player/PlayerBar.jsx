import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { loadYouTubeApi } from '../../utils/youtube'
import {
  nextSong,
  previousSong,
  setError,
  setPlaying,
  songFailed,
  togglePlay,
} from './playerSlice'
import './PlayerBar.css'

// YouTube ke error codes ka matlab
const FAILURE_REASONS = {
  100: 'It was removed or is private.',
  101: 'The owner does not allow it to play here.',
  150: 'The owner does not allow it to play here.',
}

function PlayerPanel({ song }) {
  const dispatch = useDispatch()
  const { isPlaying, error, index, queue } = useSelector((state) => state.player)

  const containerRef = useRef(null) // yahan YouTube ka player lagega
  const playerRef = useRef(null)
  const readyRef = useRef(false)
  const latest = useRef(song) // sabse naya song, YouTube ke callbacks ke liye

  useEffect(() => {
    latest.current = song
  })

  // 1) Player ek baar banao
  useEffect(() => {
    const container = containerRef.current
    const mountPoint = document.createElement('div')
    container.appendChild(mountPoint)

    let cancelled = false
    let player
    const initialId = latest.current.videoId

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return
        player = new YT.Player(mountPoint, {
          width: '100%',
          height: '100%',
          videoId: initialId,
          playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1 },
          events: {
            onReady: () => {
              readyRef.current = true
              // Taiyar hone me jo song badal gaya ho, wahi chalao
              if (latest.current.videoId !== initialId) {
                player.loadVideoById(latest.current.videoId)
              }
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) dispatch(setPlaying(true))
              else if (event.data === YT.PlayerState.PAUSED) dispatch(setPlaying(false))
              else if (event.data === YT.PlayerState.ENDED) dispatch(nextSong())
            },
            onAutoplayBlocked: () => dispatch(setPlaying(false)),
            onError: (event) =>
              dispatch(songFailed(FAILURE_REASONS[event.data] ?? 'Something went wrong.')),
          },
        })
        playerRef.current = player
      })
      .catch((err) => dispatch(setError(err.message)))

    return () => {
      cancelled = true
      readyRef.current = false
      playerRef.current = null
      player?.destroy?.()
      container.replaceChildren()
    }
  }, [dispatch])

  // 2) Song badle to naya video chalao
  useEffect(() => {
    if (readyRef.current && playerRef.current) {
      playerRef.current.loadVideoById(song.videoId)
    }
  }, [song.videoId])

  // 3) Redux ka play/pause YouTube ke player tak pahunchao
  useEffect(() => {
    const player = playerRef.current
    if (!readyRef.current || !player) return
    const { PlayerState } = window.YT
    const state = player.getPlayerState()

    if (isPlaying && state !== PlayerState.PLAYING && state !== PlayerState.BUFFERING) {
      player.playVideo()
    } else if (!isPlaying && state === PlayerState.PLAYING) {
      player.pauseVideo()
    }
  }, [isPlaying, song.videoId])

  return (
    <div className="player-bar" role="region" aria-label="Music player">
      <div className="player-video" ref={containerRef} />

      <div className="player-info">
        <p className="player-title" title={song.title}>{song.title}</p>
        <p className="player-artists">{song.artists.join(', ')}</p>
        {error && (
          <p className="player-error" role="alert">{error}</p>
        )}
      </div>

      <div className="player-controls">
        <button
          type="button"
          className="control-btn"
          onClick={() => dispatch(previousSong())}
          disabled={index <= 0}
          aria-label="Previous song"
        >
          <SkipBack size={22} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="control-btn primary"
          onClick={() => dispatch(togglePlay())}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} aria-hidden="true" /> : <Play size={24} aria-hidden="true" />}
        </button>

        <button
          type="button"
          className="control-btn"
          onClick={() => dispatch(nextSong())}
          disabled={index >= queue.length - 1}
          aria-label="Next song"
        >
          <SkipForward size={22} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

function PlayerBar() {
  const song = useSelector((state) => state.player.queue[state.player.index])
  if (!song) return null
  return <PlayerPanel song={song} />
}

export default PlayerBar