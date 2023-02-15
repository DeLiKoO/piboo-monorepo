import Message, { MessageClass } from '@common/Message';
import PrintingManagerMessage from '@common/PrintingManagerMessage';
import { MessageType } from '@common/PrintingManagerMessage';
import Settings from '@common/Settings';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkMiddleware } from 'redux-thunk';
import { AppState } from './appReducer';
import { onPrintingCompleted } from './reducers/seriesControlSlice';

const ipcRenderer = window.electron.ipcRenderer;
let settings: Omit<Settings, 'template'> = { printer: { printerName: "Canon_TS8200_series" } };

export const startPrinting = () => {
  return {
    class: MessageClass.PRINTING_MANAGER,
    type: MessageType.PRINTING_PRINT_START,
    args: settings,
  };
}

// TODO: Check how to import proper types instead of this
interface HasDispatch {
  dispatch: (action: AnyAction) => void;
}

const messageHandler = (store: HasDispatch) => (_, arg0: any) => {
  const message = arg0 as Message;
  const { dispatch } = store;
  if (message.class === MessageClass.PRINTING_MANAGER) {
    const msg = message as PrintingManagerMessage;
    switch (msg.type) {
      case MessageType.PRINTING_PRINT_COMPLETED:
        dispatch(onPrintingCompleted());
        break;
      case MessageType.PRINTING_PRINT_ERROR:
        dispatch(onPrintingCompleted());
        break;
      default:
        break;
    }
  }
}

function printingIpcMiddleware(): ThunkMiddleware<AppState> {
  return store => next => action => {
    switch (action.type) {
      case 'settings':
        console.debug("Loaded settings:", settings);
        settings = action.payload as Settings;
        break;
      case 'seriesControl/startPrinting':
        ipcRenderer.send('message', startPrinting());
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


export default printingIpcMiddleware;