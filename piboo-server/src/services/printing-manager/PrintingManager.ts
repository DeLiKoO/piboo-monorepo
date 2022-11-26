import PrinterSettings from "../../features/printing/PrinterSettings";
import PrintingProcessor from "../../features/printing/PrintingProcessor";
import { MessageClass } from "../Message";
import PrintingManagerMessage, { MessageType } from "./PrintingManagerMessage";

interface PrintingPrintStartArgs {
    printer: PrinterSettings;
    // start: string; // path of the first image of the series
    // count: number; // number of images to print
    // collageLayoutName: string; // name of the collage layout to use
}

export default abstract class PrintingManager {

    async handleMessage(message: PrintingManagerMessage) {
        switch (message.type) {
            case MessageType.PRINTING_PRINT_START:
                await this.print(message.args as PrintingPrintStartArgs);
                break;
            default:
                throw new Error(`Unhandled type '${message.type}'`);
        }
    }

    abstract sendMessage(message: PrintingManagerMessage) : Promise<void>;

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