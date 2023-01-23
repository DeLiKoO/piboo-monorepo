import Printer, { PrintResult, PrinterSettings } from "./Printer";
import * as child_process from "child_process";

// A printing method that uses the 'lp' command (linux)
export default class LpPrinter implements Printer {

    private settings: PrinterSettings;

    constructor(settings: PrinterSettings) {
        this.settings = settings;
    }

    async print(filename: string): Promise<PrintResult> {
        //    const buffer = fs.readFileSync(filename);

        child_process.spawn(
            "lp",
            [
                "-d", this.settings.printerName,
                "-o", "media=4x6.Borderless",
                "-o", "print-scaling=none",
                "-o", "media-source=rear",
                "-o", "media-top-margin=0",
                "-o", "media-left-margin=0",
                "-o", "media-right-margin=0",
                "-o", "media-bottom-margin=0",
                "--", filename
            ],
            {
                timeout: 10000,
            }
        )

        return new Promise((resolve) => {setTimeout(() => resolve({ status: "OK" }), 10000)});
    }
}