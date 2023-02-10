import PrintingProcessor from "../../features/printing/PrintingProcessor";
import { MessageClass } from "@common/Message";
import PrintingManagerMessage, { MessageType, PrinterSettings } from "@common/PrintingManagerMessage";

type SendMessageCallback = (message: PrintingManagerMessage) => Promise<void>;

interface PrintingPrintStartArgs {
    printer: PrinterSettings;
    // start: string; // path of the first image of the series
    // count: number; // number of images to print
    // collageLayoutName: string; // name of the collage layout to use
}

export default class PrintingManager {

    private sendMessage: SendMessageCallback;

    constructor(sendMessage: SendMessageCallback) {
        this.sendMessage = sendMessage;
    }

    async handleMessage(message: PrintingManagerMessage) {
        switch (message.type) {
            case MessageType.PRINTING_PRINT_START:
                await this.print(message.args as PrintingPrintStartArgs);
                break;
            default:
                throw new Error(`Unhandled type '${message.type}'`);
        }
    }

    async print(args: PrintingPrintStartArgs) {
        const printingProcessor = new PrintingProcessor(args.printer);
        try {
            const data = await printingProcessor.run();
            this.sendMessage({
                class: MessageClass.PRINTING_MANAGER,
                type: MessageType.PRINTING_PRINT_COMPLETED,
                data
            });
        } catch(err) {
            console.error('PrintingManager error:', err);
            this.sendMessage({
                class: MessageClass.PRINTING_MANAGER,
                type: MessageType.PRINTING_PRINT_ERROR,
                err
            });
        }
    }

}