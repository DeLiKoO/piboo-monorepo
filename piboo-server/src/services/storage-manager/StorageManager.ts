import { MessageClass } from "../Message";
import StorageManagerMessage, { MessageType } from "./StorageManagerMessage";

import * as fs from 'fs';
import * as path from 'path';

import { CAPTURE_PATH } from '../../appConfig';

// interface SavePictureArgs {
//     dataUri: string,
// }

// interface PictureSavedArgs {
//     // dataUri: string,
//     path: string,
// }


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
  
  async function saveCapture(directory: fs.PathLike, data: string | NodeJS.ArrayBufferView): Promise<string> {
    const filePath = path.resolve(directory.toString(), buildFilename());
    await writeFile(filePath, data);
    return filePath;
  }

export default abstract class StorageManager {

    async handleMessage(message: StorageManagerMessage) {
        switch (message.type) {
            case MessageType.STORAGE_SAVE_PICTURE:
                ensureDirExists(CAPTURE_PATH);
                const result = await saveCapture(CAPTURE_PATH, Buffer.from(message.args.dataUri, 'base64'));
                this.sendMessage({
                    class: MessageClass.STORAGE_MANAGER,
                    type: MessageType.STORAGE_PICTURE_SAVED,
                    args: {path: result},
                });
                break;
            default:
                throw new Error(`Unhandled type '${message.type}'`);
        }
    }

    abstract sendMessage(message: StorageManagerMessage) : Promise<void>;

}