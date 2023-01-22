import { combineReducers } from '@reduxjs/toolkit';
import captureControlReducer from './reducers/captureControlSlice';
import seriesControlReducer from './reducers/seriesControlSlice';
import { actionReducer } from '../lib/use-redux-effect';

const appReducer = combineReducers({
    captureControl: captureControlReducer,
    seriesControl: seriesControlReducer,
    action: actionReducer,
})

export default appReducer;
export type AppState = ReturnType<typeof appReducer>;

// TODO: Create a typed useAppReducer hook for useReducer ?