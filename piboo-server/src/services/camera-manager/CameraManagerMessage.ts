import Frame from "../../features/camera/Frame";
import Message from "../Message";

export enum MessageType {
    // Incoming
    CAMERA_ALLOC_CONNECT,
    CAMERA_DISCONNECT_DISPOSE,
    CAMERA_START_LIVEPREVIEW,
    CAMERA_STOP_LIVEPREVIEW,
    CAMERA_TAKESNAPSHOT,
    // Outgoing
    CAMERA_LIVEPREVIEW_FRAME,
    CAMERA_SNAPSHOT_FRAME,
}

export default interface CameraManagerMessage extends Message {
    type: MessageType,
    args?: any, // anyObject
    frame?: Frame,
}
