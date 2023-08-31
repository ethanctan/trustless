import { createSlice } from '@reduxjs/toolkit'

// Epoch notation: 
// Epochs are denoted by integers.
// During an epoch, we can either be before or during a survey. 
// Once a survey is complete, we move to the next epoch and before that epoch's survey. Hence there is no 'after' value.

export const epochSlice = createSlice({
    name: 'epoch',
    initialState: {
      epoch: 0,
      surveyStatus: 'before',
    },
    reducers: {
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