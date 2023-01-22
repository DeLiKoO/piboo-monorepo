import { AnyAction } from '@reduxjs/toolkit';
import { ThunkMiddleware } from 'redux-thunk';
import { AppState } from './appReducer';
import { onPrintingCompleted } from './reducers/seriesControlSlice';

const ipcRenderer = window.electron.ipcRenderer;

// TODO: Import types from 'piboo-server'
type Message = any;
type PrintingManagerMessage = any;
enum MessageClass {
  PRINTING_MANAGER = 1,
};
enum MessageType {
  // Incoming
  PRINTING_PRINT_START,
  // Outgoing
  PRINTING_PRINT_COMPLETED,
  PRINTING_PRINT_ERROR,
};

export const startPrinting = () => {
  return {
    class: MessageClass.PRINTING_MANAGER,
    type: MessageType.PRINTING_PRINT_START,
    args: {
      printer: {
        printerName: "Canon_TS8200_series",
      }
    }
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
    const pmm = message as PrintingManagerMessage;
    switch (pmm.type) {
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