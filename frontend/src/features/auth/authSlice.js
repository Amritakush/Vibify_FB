import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../services/api'

// Server jab error bheje to form ko message aur field-wise errors dono mil jayein
const toRejected = (err) => ({ message: err.message, errors: err.errors })

// App khulte hi: cookie se pata karo ki kaun login hai
export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
  try {
    const res = await api('/auth/me')
    return res.data
  } catch (err) {
    if (err.status === 401) return null // login nahi hai, ye error nahi, normal baat hai
    throw err
  }
})

export const registerUser = createAsyncThunk(
  'auth/register',
  async (form, { rejectWithValue }) => {
    try {
      const res = await api('/auth/register', { method: 'POST', body: form })
      return res.data
    } catch (err) {
      return rejectWithValue(toRejected(err))
    }
  },
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (form, { rejectWithValue }) => {
    try {
      const res = await api('/auth/login', { method: 'POST', body: form })
      return res.data
    } catch (err) {
      return rejectWithValue(toRejected(err))
    }
  },
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api('/auth/logout', { method: 'POST' })
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    initialized: false, // true tab hoga jab "kaun login hai" ki jaanch poori ho
    submitting: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.initialized = true
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null
        state.initialized = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
      })

    // register aur login ka kaam ek jaisa hai
    for (const thunk of [registerUser, loginUser]) {
      builder
        .addCase(thunk.pending, (state) => {
          state.submitting = true
          state.error = null
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.submitting = false
          state.user = action.payload
        })
        .addCase(thunk.rejected, (state, action) => {
          state.submitting = false
          state.error = action.payload ?? { message: action.error.message }
        })
    }
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer