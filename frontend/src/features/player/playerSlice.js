import { createSlice } from '@reduxjs/toolkit'

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    queue: [], // songs ki list jo chal rahi hai
    index: -1, // queue me kaun sa song chal raha hai (-1 = koi nahi)
    isPlaying: false,
    error: null,
  },
  reducers: {
    // Card par click: ye list queue ban jaati hai, aur us song se chalna shuru
    playQueue(state, action) {
      state.queue = action.payload.songs
      state.index = action.payload.index
      state.isPlaying = true
      state.error = null
    },
    togglePlay(state) {
      if (state.index >= 0) state.isPlaying = !state.isPlaying
    },
    setPlaying(state, action) {
      state.isPlaying = action.payload
    },
    nextSong(state) {
      if (state.index < state.queue.length - 1) {
        state.index += 1
        state.isPlaying = true
        state.error = null
      } else {
        state.isPlaying = false // queue khatam
      }
    },
    previousSong(state) {
      if (state.index > 0) {
        state.index -= 1
        state.isPlaying = true
        state.error = null
      }
    },
    // Song chal nahi paaya: wajah batao aur agle song par jao
    songFailed(state, action) {
      const failed = state.queue[state.index]
      const hasNext = state.index < state.queue.length - 1
      state.error = `“${failed?.title ?? 'This song'}” can’t be played. ${action.payload}${
        hasNext ? ' Skipped to the next song.' : ''
      }`
      if (hasNext) {
        state.index += 1
      } else {
        state.isPlaying = false
      }
    },
    // Player hi load nahi hua (jaise internet band)
    setError(state, action) {
      state.error = action.payload
      state.isPlaying = false
    },
  },
})

export const { playQueue, togglePlay, setPlaying, nextSong, previousSong, songFailed, setError } =
  playerSlice.actions
export default playerSlice.reducer