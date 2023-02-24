import { AnyAction, createAction } from '@reduxjs/toolkit';
import { ThunkMiddleware } from 'redux-thunk';
import { AppState } from '.';
import { MessageClass } from "@common/Message";
import SettingsManagerMessage, { MessageType } from "@common/SettingsManagerMessage";
import Message from "@common/Message";
import Settings from '@common/Settings';

const ipcRenderer = window.electron.ipcRenderer;

export const getSettings = () => {
  return {
    class: MessageClass.SETTINGS_MANAGER,
    type: MessageType.GET_SETTINGS,
  };
}

// dispatched when settings are received
export const settings = createAction<Settings>('settings');
export const loadSettings = createAction<void>('loadSettings');

// TODO: Check how to import proper types instead of this
interface HasDispatch {
  dispatch: (action: AnyAction) => void;
}

const messageHandler = (store: HasDispatch) => (_, arg0: any) => {
  const message = arg0 as Message;
  const { dispatch } = store;
  if (message.class === MessageClass.SETTINGS_MANAGER) {
    const msg = message as SettingsManagerMessage;
    switch (msg.type) {
      case MessageType.SETTINGS:
        dispatch(settings(msg.args[0] as Settings));
        break;
      default:
        break;
    }
  }
}

function ipcMiddleware(): ThunkMiddleware<AppState> {
  return store => next => action => {
    switch (action.type) {
      case 'loadSettings':
        const message = getSettings();
        ipcRenderer.send('message', message);
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