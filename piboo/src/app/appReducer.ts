import { combineReducers } from '@reduxjs/toolkit';
import captureControlReducer from './reducers/captureControlSlice';
import seriesControlReducer from './reducers/seriesControlSlice';

const appReducer = combineReducers({
    captureControl: captureControlReducer,
    seriesControl: seriesControlReducer,
})

export default appReducer;
export type AppState = ReturnType<typeof appReducer>;

// TODO: Create a typed useAppReducer hook for useReducer ?