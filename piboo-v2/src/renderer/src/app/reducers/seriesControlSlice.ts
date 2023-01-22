import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppState } from '../appReducer';
import { countdown } from './captureControlSlice';

const SERIES_NOT_STARTED = 0;

export const seriesControlSlice = createSlice({
  name: 'seriesControl',
  initialState: {
    captureInSeries: SERIES_NOT_STARTED,
    printing: false,
  },
  reducers: {
    incrementCaptureInSeries: state => {
        state.captureInSeries += 1;
    },
    onSeriesCompleted: state => {
        state.captureInSeries = SERIES_NOT_STARTED;
    },
    startPrinting: state => {
      state.printing = true;
    },
    onPrintingCompleted: state => {
      state.printing = false;
    },
  },
});

export const { incrementCaptureInSeries, onSeriesCompleted, startPrinting, onPrintingCompleted } = seriesControlSlice.actions;

// startSeries thunk
export const startSeries = createAsyncThunk(
  'startSeries',
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    // TODO: Improve typing here: avoid cast
    const state = thunkAPI.getState() as AppState;
    if(state.seriesControl.captureInSeries > SERIES_NOT_STARTED) {
      return;
    }
    dispatch(incrementCaptureInSeries());
    dispatch(countdown());
    setTimeout(() => {
      dispatch(incrementCaptureInSeries());
      dispatch(countdown());
    }, 5000);
    setTimeout(() => {
      dispatch(incrementCaptureInSeries());
      dispatch(countdown());
    }, 10000);
    setTimeout(() => {
      dispatch(startPrinting());
      dispatch(onSeriesCompleted());
    }, 15000);
  }
);

// counter selector
export const selectCaptureInSeries = (state: AppState) => state.seriesControl.captureInSeries;
export const isPrinting = (state: AppState) => state.seriesControl.printing;

export default seriesControlSlice.reducer;
