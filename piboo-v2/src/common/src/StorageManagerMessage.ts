import Message from "./Message";

export enum MessageType {
    // Incoming
    SAVE_PICTURE,
    // Outgoing
    PICTURE_SAVED,
}

export default interface StorageManagerMessage extends Message {
    type: MessageType,
    args?: any, // anyObject
}
