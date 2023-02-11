import { MessageClass } from "@common/Message";
import StorageManagerMessage, { MessageType } from "@common/StorageManagerMessage";

import * as fs from 'fs';
import * as path from 'path';

import { CAPTURE_PATH } from '../../appConfig';

  function ensureDirExists(dirPath: fs.PathLike) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    } else {
      const stat = fs.lstatSync(dirPath);
      if (!stat.isDirectory()) {
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
    ensureDirExists(directory);
    const filePath = path.resolve(directory.toString(), buildFilename());
    await writeFile(filePath, data);
    return filePath;
  }

type SendMessageCallback = (message: StorageManagerMessage) => Promise<void>;

export default class StorageManager {

  private sendMessage: SendMessageCallback;

  constructor(sendMessage: SendMessageCallback) {
      this.sendMessage = sendMessage;
  }

  async handleMessage(message: StorageManagerMessage) {
      switch (message.type) {
          case MessageType.SAVE_PICTURE:
              const imagePart = message.args.dataUri.replace(/^data:image\/\w+;base64,/, "");
              const result = await saveCapture(CAPTURE_PATH, Buffer.from(imagePart, 'base64'));
              this.sendMessage({
                  class: MessageClass.STORAGE_MANAGER,
                  type: MessageType.PICTURE_SAVED,
                  args: {path: result},
              });
              break;
          default:
              throw new Error(`Unhandled type '${message.type}'`);
      }
  }

}