import CameraManager from '../../services/camera-manager/CameraManager';
import CameraManagerMessage from "../../services/camera-manager/CameraManagerMessage";
import Message, { MessageClass } from '../../services/Message';
import { ChildProcess } from 'child_process';

export default class IpcCameraManager extends CameraManager {

    process: ChildProcess | null;

    constructor(process: ChildProcess) {
        super();
        this.process = process;
        const instance = this;
        process.on('message', function incoming(arg0: any) {
            const message: Message = arg0 as Message;
            switch(message.class) {
                case MessageClass.CAMERA_MANAGER:
                    instance.handleMessage(message as CameraManagerMessage);
                    break;
                default:
                    throw new Error(`Unhandled message class : '${message.class}'`);
            }
        });
    }

    async sendMessage(message: CameraManagerMessage): Promise<void> {
        this.process!.send(message);
    }

    dispose() {
        this.process = null;
    }

}