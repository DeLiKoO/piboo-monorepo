export enum MessageClass {
    STORAGE_MANAGER,
    PRINTING_MANAGER,
}

export default interface Message {
    class: MessageClass,
}
