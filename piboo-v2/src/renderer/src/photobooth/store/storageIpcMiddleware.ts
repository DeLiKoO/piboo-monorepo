import { AnyAction, createAction } from '@reduxjs/toolkit';
import { ThunkMiddleware } from 'redux-thunk';
import { AppState } from '.';
import { MessageClass } from "@common/Message";
import StorageManagerMessage, { MessageType } from "@common/StorageManagerMessage";
import Message from "@common/Message";

const ipcRenderer = window.electron.ipcRenderer;

export const savePicture = (dataUri: string) => {

  return {
    class: MessageClass.STORAGE_MANAGER,
    type: MessageType.SAVE_PICTURE,
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
  const message = arg0 as Message;
  const { dispatch } = store;
  if (message.class === MessageClass.STORAGE_MANAGER) {
    const msg = message as StorageManagerMessage;
    switch (msg.type) {
      case MessageType.PICTURE_SAVED:
        dispatch(pictureSaved());
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
        ipcRenderer.send('message', message);
        // NOTICE: Only register a one-time listener
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