export enum MessageClass {
    CAMERA_MANAGER,
    PRINTING_MANAGER,
}

export default interface Message {
    class: MessageClass,
}
