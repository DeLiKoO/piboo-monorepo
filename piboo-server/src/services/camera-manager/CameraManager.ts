import AbstractCamera from "../../features/camera/AbstractCamera";
import CameraFactory from "../../features/camera/CameraFactory";
import Driver from "../../features/camera/Driver";
import Frame from "../../features/camera/Frame";
import LivePreviewCallback from "../../features/camera/LivePreviewCallback";
import { MessageClass } from "../Message";
import CameraManagerMessage, { MessageType } from "./CameraManagerMessage";

interface CameraAllocConnectArgs {
    driver: Driver; // driver settings
}

export default abstract class CameraManager {

    async handleMessage(message: CameraManagerMessage) {
        switch (message.type) {
            case MessageType.CAMERA_ALLOC_CONNECT:
                await this.cameraAllocConnect(message.args as CameraAllocConnectArgs);
                break;
            case MessageType.CAMERA_DISCONNECT_DISPOSE:
                await this.disconnectDispose();
                break;
            case MessageType.CAMERA_START_LIVEPREVIEW:
                await this.startLivePreview();
                break;
            case MessageType.CAMERA_STOP_LIVEPREVIEW:
                await this.stopLivePreview();
                break;
            case MessageType.CAMERA_TAKESNAPSHOT:
                const snapshot = await this.takeSnapshot();
                this.sendMessage({
                    class: MessageClass.CAMERA_MANAGER,
                    type: MessageType.CAMERA_SNAPSHOT_FRAME,
                    frame: snapshot,
                });
                break;
            default:
                throw new Error(`Unhandled type '${message.type}'`);
        }
    }

    abstract sendMessage(message: CameraManagerMessage) : Promise<void>;

    camera: AbstractCamera | undefined;
    callback: LivePreviewCallback = (frame: Frame) => {
        this.sendMessage({
            class: MessageClass.CAMERA_MANAGER,
            type: MessageType.CAMERA_LIVEPREVIEW_FRAME,
            frame
        });
    };

    async cameraAllocConnect(args: CameraAllocConnectArgs) {
        this.camera = CameraFactory.createCamera(args.driver);
        await this.camera.connect();
        this.camera.registerLivePreviewCallback(this.callback);
        await this.camera?.startLivePreview();
    }

    async disconnectDispose() {
        await this.camera?.stopLivePreview();
        await this.camera?.unregisterLivePreviewCallback(this.callback);
        await this.camera?.disconnect();
        this.camera = undefined;
    }

    async startLivePreview() {
        await this.camera?.startLivePreview();
    }

    async stopLivePreview() {
        await this.camera?.stopLivePreview();
    }

    async takeSnapshot() {
        const snapshot = await this.camera?.takeSnapshot();
        return snapshot;
    }

}