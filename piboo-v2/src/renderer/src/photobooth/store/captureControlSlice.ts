import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppState } from '.';

type Frame = string; // TODO: Import this type definition

function withPayloadType<T>() {
  return (t: T) => ({ payload: t })
}

export const captureControlSlice = createSlice({
  name: 'captureControl',
  initialState: {
    countdown: 0,
    flash: false,
    countingDown: false,
  },
  reducers: {
    startCountdown: state => {
      state.countdown = 3;
      state.countingDown = true;
    },
    stopCountdown: state => {
      state.countdown = 0;
      state.countingDown = false;
    },
    decrementCountdown: state => {
      state.countdown -= 1;
      state.flash = state.countdown == 0 ? true: false;
    },
  },
});

export const { startCountdown, stopCountdown, decrementCountdown } = captureControlSlice.actions;

export const capture = createAction('capture');
export const captureSaved = createAction('captureSaved');
// export const captureCompleted = createAction('captureCompleted');
export const startLivePreview = createAction('startLivePreview');
export const stopLivePreview = createAction('stopLivePreview');
export const onSnapshotReceived = createAction('onSnapshotReceived', withPayloadType<Frame>());

// countdown thunk
export const countdown = createAsyncThunk(
  'countdown',
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    // TODO: Improve typing here: avoid cast
    const state = thunkAPI.getState() as AppState;
    if(state.captureControl.countingDown) {
      return;
    }
    dispatch(startLivePreview());
    dispatch(startCountdown());
    setTimeout(() => {
      dispatch(decrementCountdown());
    }, 1000);
    setTimeout(() => {
      dispatch(decrementCountdown());
    }, 2000);
    setTimeout(() => {
      dispatch(decrementCountdown());
      dispatch(capture());
      dispatch(stopCountdown());
      dispatch(stopLivePreview());
    }, 3000);
  }
);

// counter selector
export const selectCountdown = (state: AppState) => state.captureControl.countdown;

export default captureControlSlice.reducer;
