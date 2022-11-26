import WebSocket from 'ws';
import CameraManager from '../../services/camera-manager/CameraManager';
import CameraManagerMessage from "../../services/camera-manager/CameraManagerMessage";
import Message, { MessageClass } from '../../services/Message';

export default class WebSocketCameraManager extends CameraManager {

    webSocket: WebSocket;

    constructor(ws: WebSocket) {
        super();
        this.webSocket = ws;
        const instance = this;
        ws.on('message', function incoming(data) {
            console.log("WebSocketCameraManager received message", data.toString());
            const message: Message = JSON.parse(data.toString('utf-8'));
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
        this.webSocket.send(JSON.stringify(message));
    }

}