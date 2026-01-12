import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  gigs: [],
  loading: false,
  error: null,
}

const gigsSlice = createSlice({
  name: 'gigs',
  initialState,
  reducers: {
    setGigs: (state, action) => {
      state.gigs = action.payload
      state.error = null
    },
    addGig: (state, action) => {
      state.gigs.unshift(action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setGigs, addGig, setLoading, setError } = gigsSlice.actions
export default gigsSlice.reducer
