import Message from "./Message";

export enum MessageType {
    // Incoming
    GET_SETTINGS,
    LIST_TEMPLATES,
    GET_TEMPLATE,
    // Outgoing
    SETTINGS,
    TEMPLATES_LIST,
    TEMPLATE,
}

export default interface SettingsManagerMessage extends Message {
    type: MessageType,
    args?: any, // anyObject
}
