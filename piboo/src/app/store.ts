// For more information, see: https://redux-toolkit.js.org/usage/usage-with-typescript
import { AnyAction, configureStore, getDefaultMiddleware, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import appReducer, { AppState } from './appReducer';
import storageIpcMiddleware from './storageIpcMiddleware';
import printingIpcMiddleware from './printingIpcMiddleware';

const store = configureStore({
  reducer: appReducer,
  middleware: [
    ...getDefaultMiddleware(), 
    storageIpcMiddleware(),
    printingIpcMiddleware(),
  ],
});

export type AppDispatch = typeof store.dispatch

// Export a hook that can be reused to resolve types
// Use this instead of useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch & ThunkDispatch<AppState, null, AnyAction>>()

export type AppStore = typeof store;

export default store;
