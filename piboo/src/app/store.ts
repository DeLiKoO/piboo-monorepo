// For more information, see: https://redux-toolkit.js.org/usage/usage-with-typescript
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import appReducer from './appReducer';
import cameraIpcMiddleware from './cameraIpcMiddleware';
import captureMiddleware from './captureMiddleware';
import printingIpcMiddleware from './printingIpcMiddleware';

const store = configureStore({
  reducer: appReducer,
  middleware: [
    ...getDefaultMiddleware(), 
    cameraIpcMiddleware(),
    captureMiddleware(),
    printingIpcMiddleware(),
  ],
});

export type AppDispatch = typeof store.dispatch

// Export a hook that can be reused to resolve types
// Use this instead of useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export type AppStore = typeof store;

export default store;
