import PrintingManager from '../../services/printing-manager/PrintingManager';
import PrintingManagerMessage from "../../services/printing-manager/PrintingManagerMessage";
import Message, { MessageClass } from '../../services/Message';
import { ChildProcess } from 'child_process';

export default class IpcPrintingManager extends PrintingManager {

    process: ChildProcess | null;

    constructor(process: ChildProcess) {
        super();
        this.process = process;
        const instance = this;
        process.on('message', function incoming(arg0: any) {
            const message: Message = arg0 as Message;
            switch(message.class) {
                case MessageClass.PRINTING_MANAGER:
                    instance.handleMessage(message as PrintingManagerMessage);
                    break;
                default:
                    throw new Error(`Unhandled message class : '${message.class}'`);
            }
        });
    }

    async sendMessage(message: PrintingManagerMessage): Promise<void> {
        this.process!.send(message);
    }

    dispose() {
        this.process = null;
    }

}