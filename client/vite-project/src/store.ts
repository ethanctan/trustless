import { configureStore } from '@reduxjs/toolkit'
import epochReducer from './slices/epochSlice'

export const store = configureStore({
  reducer: {
    epoch: epochReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch