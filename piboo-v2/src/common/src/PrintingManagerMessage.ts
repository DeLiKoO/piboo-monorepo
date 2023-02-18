import Message from "./Message";

export interface PrintResult {
    status: "OK" | "ERROR";
}

export interface PrinterSettings {
    printerName: string,
    printerOptions: Record<string, string>,
}

export enum MessageType {
    // Incoming
    PRINTING_PRINT_START,
    // Outgoing
    PRINTING_PRINT_COMPLETED,
    PRINTING_PRINT_ERROR,
}

export default interface PrintingManagerMessage extends Message {
    type: MessageType,
    args?: any, // anyObject
    data?: PrintResult, // TODO: Add proper typing
    err?: unknown,
}
