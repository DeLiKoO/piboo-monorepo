import { PrintResult } from "../../features/printing/Printer";
import Message from "../Message";

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
