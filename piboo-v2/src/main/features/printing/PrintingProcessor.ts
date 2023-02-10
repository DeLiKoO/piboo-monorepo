import * as fs from 'fs';
import * as path from 'path';

import CollageRenderer from '../collage/PdfKitCollageRenderer';

import { PrinterSettings, PrintResult } from "@common/PrintingManagerMessage";
import { CAPTURE_PATH } from '../../appConfig';
import LpPrinter from './LpPrinter';

// TODO: Move this implementation up to PrintingManager
export default class PrintingProcessor {

    private printer: LpPrinter;
    private capturePath: string;

    constructor(printerSettings: PrinterSettings, capturePath?: string) {
        this.capturePath = capturePath || CAPTURE_PATH;
        this.printer = new LpPrinter(printerSettings);
    }

    async run(): Promise<PrintResult> {

        const PICTURES_PER_PAGE = 3;
        const capturePath = this.capturePath;

        // Get last 3 photos
        let list = fs.readdirSync(capturePath);
        list = list.filter(filename => filename.match(/.*\.jpg$/));
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
        const result = await this.printer.print(outFilename);
        if(result.status !== "OK") {
            throw new Error("Printing error, status: " + result.status);
        }
        return result;
    
    }

}
