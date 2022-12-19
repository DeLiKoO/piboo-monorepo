import { AnyAction } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import { ThunkMiddleware } from 'redux-thunk';
import { AppState } from './appReducer';
import { onSnapshotReceived } from './reducers/captureControlSlice';

// TODO: Import types from 'piboo-server'
type Message = any;
type CameraManagerMessage = any;
enum MessageClass {
  CAMERA_MANAGER
};
enum MessageType {
  // Incoming
  CAMERA_ALLOC_CONNECT,
  CAMERA_DISCONNECT_DISPOSE,
  CAMERA_START_LIVEPREVIEW,
  CAMERA_STOP_LIVEPREVIEW,
  CAMERA_TAKESNAPSHOT,
  // Outgoing
  CAMERA_LIVEPREVIEW_FRAME,
  CAMERA_SNAPSHOT_FRAME,
};

// Camera management message creators
export const bindToCamera = (path?: string) => {

  return {
    class: MessageClass.CAMERA_MANAGER,
    type: MessageType.CAMERA_ALLOC_CONNECT,
    args: {
      driver: {
        name: "V4L",
        settings: {
          path: path || '/dev/video0',
        },
      },
    }
  };
}

export const capture = () => {
  return {
    class: MessageClass.CAMERA_MANAGER,
    type: MessageType.CAMERA_TAKESNAPSHOT,
  };
}

export const startLivePreview = () => {
  return {
    class: MessageClass.CAMERA_MANAGER,
    type: MessageType.CAMERA_START_LIVEPREVIEW,
  };
}

export const stopLivePreview = () => {
  return {
    class: MessageClass.CAMERA_MANAGER,
    type: MessageType.CAMERA_STOP_LIVEPREVIEW,
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
  if (message.class === MessageClass.CAMERA_MANAGER) {
    const cmm = message as CameraManagerMessage;
    switch (cmm.type) {
      case MessageType.CAMERA_LIVEPREVIEW_FRAME:
        // NOTICE: Let the LivePreview component handle this
        // dispatch(onLiveFrameReceived(cmm.frame));
        break;
      case MessageType.CAMERA_SNAPSHOT_FRAME:
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
      case 'capture':
        ipcRenderer.send('message', capture());
        break;
      case 'startLivePreview':
        ipcRenderer.send('message', startLivePreview());
        break;
      case 'stopLivePreview':
        ipcRenderer.send('message', stopLivePreview());
        break;
      case 'bindToCamera':
        const devicePath = action.payload as string;
        ipcRenderer.send('message', bindToCamera(devicePath));
        ipcRenderer.on('message', messageHandler(store));
        break;
      default:
        // Nothing to do...
        break;
    }
    next(action);
  }

}


export default ipcMiddleware;