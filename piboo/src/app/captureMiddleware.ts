import { ThunkMiddleware } from 'redux-thunk';
import { AppState } from './appReducer';
import * as fs from 'fs';
import * as path from 'path';
import { CAPTURE_PATH } from '../appConfig';
import { captureSaved } from './reducers/captureControlSlice'; // NOTICE: Beware of circular references !

/** Ensure directory is created */
function ensureDirExists(dirPath: fs.PathLike) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  } else {
    const stat = fs.lstatSync(dirPath);
    if (!fs.lstatSync(dirPath).isDirectory()) {
      throw new Error(`Capture path ('${dirPath}') is set to an existing filename, instead of a directory.`);
    }
  }
}

async function writeFile(filePath: fs.PathLike | number, data: string | NodeJS.ArrayBufferView, options: fs.WriteFileOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, options, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      else {
        console.log("Saved ", filePath);
        resolve();
      }
    })
  });
}

function buildFilename(base: string = 'IMG') {
  const date = new Date();
  const dateString = date.toLocaleString('en-GB', { timeZone: 'UTC' })
    .replace(/:/g, "")
    .replace(/\//g, "-")
    .replace(/,/g, "")
    .replace(/ /g, "_");
  const filename = `${base}_${dateString}.jpg`;
  return filename;
}

async function saveCapture(directory: fs.PathLike | number, data: string | NodeJS.ArrayBufferView): Promise<void> {
  const filePath = path.resolve(directory.toString(), buildFilename());
  return writeFile(filePath, data);
}

function captureMiddleware(): ThunkMiddleware<AppState> {
  return (store) => (next) => async (action) => {
    switch (action.type) {
      case 'onSnapshotReceived':
        ensureDirExists(CAPTURE_PATH);
        await saveCapture(CAPTURE_PATH, Buffer.from(action.payload, 'base64'));
        store.dispatch(captureSaved());
        break;
      default:
        // Nothing to do...
        break;
    }
    next(action);
  }
}


export default captureMiddleware;