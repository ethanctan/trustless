import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Epoch notation: 
// Epochs are denoted by integers.
// During an epoch, we can either be before or during a survey. 
// Once a survey is complete, we move to the next epoch and before that epoch's survey. Hence there is no 'after' value.

// Define a type for the slice state
interface EpochState {
    epoch: number,
    surveyStatus: 'before' | 'during',
}

// Define the initial state using that type
const initialState: EpochState = {
    epoch: 0,
    surveyStatus: 'before',
}


export const epochSlice = createSlice({
    name: 'epoch',
    initialState,
    reducers: { // define functions that change the state
      incrementEpoch: (state) => {
        state.epoch += 1
      },
      decrementEpoch: (state) => {
        state.epoch -= 1
      },
      setEpoch: (state, action) => {
        if (!Number.isInteger(action.payload)) {
            return {
              ...state,
              error: 'Value must be an integer'
            }
          }
        state.epoch = action.payload
      },
      setSurveyStatus: (state, action) => {
        if (action.payload != 'before' && action.payload != 'during') {
            return {
              ...state,
              error: 'Position relative to an epoch must be either "before" or "during"'
            }
        }
        state.surveyStatus = action.payload
      }
    },
  })

// idk what this means in the sample code
// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export const { incrementEpoch, decrementEpoch, setEpoch, setSurveyStatus } = epochSlice.actions

export default epochSlice.reducer