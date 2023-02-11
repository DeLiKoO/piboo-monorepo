import Message from "./Message";

export enum MessageType {
    // Incoming
    LIST_TEMPLATES,
    // Outgoing
    TEMPLATES_LIST,
}

export default interface TemplateManagerMessage extends Message {
    type: MessageType,
    args?: any, // anyObject
}
