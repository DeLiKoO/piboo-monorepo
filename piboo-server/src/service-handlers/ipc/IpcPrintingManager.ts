import { IpcRenderer, IpcRendererEvent } from 'electron';
import PrintingManager from '../../services/printing-manager/PrintingManager';
import PrintingManagerMessage from "../../services/printing-manager/PrintingManagerMessage";
import Message, { MessageClass } from '../../services/Message';

export default class IpcPrintingManager extends PrintingManager {

    ipc: IpcRenderer | null;
    sender: IpcRenderer | null;;

    constructor(ipc: IpcRenderer) {
        super();
        this.ipc = ipc;
        this.sender = null;
        const instance = this;
        ipc.on('message', function incoming(event: IpcRendererEvent, arg0: any) {
            // TODO: Change architecture to introduce the concept of request & response
            // There should be a Server class in charge of protocol (handling requests and sending responses)
            // The Server should use a Manager that provides concrete operations
            instance.sender = event.sender;
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
        this.sender!.send('message', message);
    }

    dispose() {
        this.ipc = null;
        this.sender = null;
    }

}