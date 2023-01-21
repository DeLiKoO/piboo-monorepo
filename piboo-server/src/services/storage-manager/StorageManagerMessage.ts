import Message from "../Message";

export enum MessageType {
    // Incoming
    STORAGE_SAVE_PICTURE,
    // Outgoing
    STORAGE_PICTURE_SAVED,
}

export default interface CameraManagerMessage extends Message {
    type: MessageType,
    args?: any, // anyObject
}
