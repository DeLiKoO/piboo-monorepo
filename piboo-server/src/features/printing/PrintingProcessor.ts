import * as fs from 'fs';
import * as path from 'path';
import createPrinter, { Printer, Options, Job } from 'node-lp';

import CollageRenderer from '../collage/PdfKitCollageRenderer';
import PrinterSettings from './PrinterSettings';

const DEFAULT_CAPTURE_PATH = process.env.CAPTURE_PATH || path.resolve(process.cwd(), 'public', '.capture');
const PRINTER_PRINT_TIMEOUT_MS = 10000;

export type PrintingResult = string;

export default class PrintingProcessor {

    private printerSettings: PrinterSettings;
    private capturePath: string;

    constructor(printerSettings: PrinterSettings, capturePath?: string) {
        this.printerSettings = printerSettings;
        this.capturePath = capturePath || DEFAULT_CAPTURE_PATH;
    }

    async run(): Promise<PrintingResult> {

        const PICTURES_PER_PAGE = 3;
        const capturePath = this.capturePath;

        // Get last 3 photos
        let list = fs.readdirSync(capturePath);
        if(list.length < PICTURES_PER_PAGE) {
            const err = new Error(`Not enough pictures available (${PICTURES_PER_PAGE} required, got ${list.length}).`);
            console.error('PrintingProcessor error:', err);
            throw err;
        }
        list = list.slice(-PICTURES_PER_PAGE);
        list = list.map(filename => path.resolve(capturePath, filename));
    
        // Render our collage to a file for printing
        let images: [string, string, string] = [ list[0], list[1], list[2] ];
        const cp = new CollageRenderer(images);
        const outFilename = await cp.render(capturePath);
    
        // Send the file to printer
        // TODO: Add printing options as needed.
        const printerName = this.printerSettings.printerName;
        const result = await this.print(outFilename, { destination: printerName }); // string
        return result as PrintingResult; // string 
    
    }

    private async print(filename: string, options: Options): Promise<Job> {
        return new Promise((resolve, reject) => {
            // Configure printer
            const printer: Printer = createPrinter(options);
            console.log({printer});
            let canceled = false;
            // Setup a 10s printer timeout
            setTimeout(() => { 
                canceled = true; 
                reject(new Error('Operation timed out'));
            }, PRINTER_PRINT_TIMEOUT_MS);
            // Start printing
            const job = printer.queueFile(filename, (err, data) => {
                if(canceled) return;
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

}
