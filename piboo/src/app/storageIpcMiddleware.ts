import { AnyAction } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import { ThunkMiddleware } from 'redux-thunk';
import { AppState } from './appReducer';
import { captureSaved, onSnapshotReceived } from './reducers/captureControlSlice';

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

// TODO: Check how to import proper types instead of this
interface HasDispatch {
  dispatch: (action: AnyAction) => void;
}

const messageHandler = (store: HasDispatch) => (event: Electron.IpcRendererEvent, arg0: any) => {
  console.debug({arg0});
  const message = arg0 as Message;
  const { dispatch } = store;
  if (message.class === MessageClass.STORAGE_MANAGER) {
    const cmm = message as CameraManagerMessage;
    switch (cmm.type) {
      case MessageType.STORAGE_PICTURE_SAVED:
        dispatch(onSnapshotReceived(cmm.frame));
        break;
      default:
        break;
    }
  }
}

function ipcMiddleware(): ThunkMiddleware<AppState> {
  return store => next => action => {
    switch (action.type) {
      case 'onCaptureSaved':
        ipcRenderer.send('message', captureSaved());
        break;
      default:
        // Nothing to do...
        break;
    }
    next(action);
  }

}


export default ipcMiddleware;