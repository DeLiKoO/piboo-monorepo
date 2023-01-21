import StorageManager from '../../services/storage-manager/StorageManager';
import StorageManagerMessage from "../../services/storage-manager/StorageManagerMessage";
import Message, { MessageClass } from '../../services/Message';
import { ChildProcess } from 'child_process';

export default class IpcStorageManager extends StorageManager {

    process: ChildProcess | null;

    constructor(process: ChildProcess) {
        super();
        this.process = process;
        const instance = this;
        process.on('message', function incoming(arg0: any) {
            const message: Message = arg0 as Message;
            switch(message.class) {
                case MessageClass.STORAGE_MANAGER:
                    instance.handleMessage(message as StorageManagerMessage);
                    break;
                default:
                    throw new Error(`Unhandled message class : '${message.class}'`);
            }
        });
    }

    async sendMessage(message: StorageManagerMessage): Promise<void> {
        this.process!.send(message);
    }

    dispose() {
        this.process = null;
    }

}