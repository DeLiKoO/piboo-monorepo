import { AnyAction, createAction } from '@reduxjs/toolkit';
import { ThunkMiddleware } from 'redux-thunk';
import { AppState } from './appReducer';

const ipcRenderer = window.electron.ipcRenderer;

// TODO: Import types from 'piboo-server'
type Message = any;
type CameraManagerMessage = any;
enum MessageClass {
  STORAGE_MANAGER
};
enum MessageType {
  // Incoming
  STORAGE_SAVE_PICTURE,
  // Outgoing
  STORAGE_PICTURE_SAVED,
};

// Camera management message creators
export const savePicture = (dataUri: string) => {

  return {
    class: MessageClass.STORAGE_MANAGER,
    type: MessageType.STORAGE_SAVE_PICTURE,
    args: {
      dataUri,
    }
  };
}

export const pictureSaved = createAction('pictureSaved');

// TODO: Check how to import proper types instead of this
interface HasDispatch {
  dispatch: (action: AnyAction) => void;
}

const messageHandler = (store: HasDispatch) => (_, arg0: any) => {
  console.debug({arg0});
  const message = arg0 as Message;
  const { dispatch } = store;
  if (message.class === MessageClass.STORAGE_MANAGER) {
    const cmm = message as CameraManagerMessage;
    switch (cmm.type) {
      case MessageType.STORAGE_PICTURE_SAVED:
        dispatch(pictureSaved(cmm.frame));
        break;
      default:
        break;
    }
  }
}

function ipcMiddleware(): ThunkMiddleware<AppState> {
  return store => next => action => {
    switch (action.type) {
      case 'onSnapshotReceived':
        const message = savePicture(action.payload);
        console.log('onSnapshotReceived, sending message through ipcRenderer:', message);
        ipcRenderer.send('message', message);
        // NOTICE: Only register a one-time listener,
        //         since each PRINTING_PRINT_START request will have only one response.
        ipcRenderer.once('message', messageHandler(store));
        break;
      default:
        // Nothing to do...
        break;
    }
    next(action);
  }

}


export default ipcMiddleware;