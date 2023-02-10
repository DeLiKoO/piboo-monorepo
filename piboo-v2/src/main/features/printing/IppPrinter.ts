import { PrinterSettings, PrintResult } from "@common/PrintingManagerMessage";
import * as fs from 'fs';
import * as ipp from 'ipp';
import Printer from "./Printer";

// A printing method that uses the IPP protocol
export default class LpPrinter implements Printer {

    private settings: PrinterSettings;

    constructor(settings: PrinterSettings) {
        this.settings = settings;
    }

    async print(filename: string): Promise<PrintResult> {
        const printer = new ipp.Printer(`ipp://${this.settings.printerName}:631/ipp/printer`);
        const buffer = fs.readFileSync(filename);
        const msg: ipp.PrintJobRequest = {
            "operation-attributes-tag": {
                "requesting-user-name": "PiBoo",
                "job-name": "collage",
                "document-format": "application/pdf"
            },
            data: buffer,
        };
        printer.execute("Print-Job", msg, function(err, res){
            if(err) {
                console.error(err);
            } else {
                console.info(res);
            }
        });
        return new Promise((resolve) => {setTimeout(() => resolve({ status: "OK" }), 10000)});
    }

}