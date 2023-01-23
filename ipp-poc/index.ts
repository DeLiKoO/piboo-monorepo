import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as ipp from 'ipp';
import { GetPrinterAttributesRequest } from 'ipp';

const PRINTER_PRINT_TIMEOUT_MS = 10000;

async function print(printerUri: string, filename: string): Promise<void> {
    const printer = new ipp.Printer(printerUri, { version: "2.0" });
    const buffer = fs.readFileSync(filename);


    const gpa: GetPrinterAttributesRequest = {
        "operation-attributes-tag": {
            "requesting-user-name": "PiBoo",
        }
    };
    printer.execute("Get-Printer-Attributes", gpa, function(err, res){
        console.log(res);
    });

    const msg: ipp.PrintJobRequest = {
        "operation-attributes-tag": {
            "requesting-user-name": "PiBoo",
            "job-name": "collage",
            "document-format": "image/jpeg",
        },
        data: buffer,
    };
    printer.execute("Print-Job", msg, function(err, res){
        console.log(res);
    });
    // return new Promise((resolve) => {setTimeout(() => resolve("OK"), PRINTER_PRINT_TIMEOUT_MS)});
}

async function main() {
    // const fileToPrint = path.resolve(os.homedir(), 'Pictures', 'PiBoo', 'collage.pdf');
    const fileToPrint = path.resolve(os.homedir(), 'Pictures', 'PiBoo', 'IMG_22-01-2023_222410.jpg');
    const str: string = "hello";
    console.debug(str);
    // await print("ipp://08748D000000.local:631/ipp/print", fileToPrint);
    await print("ipp://192.168.1.122:631/ipp/print", fileToPrint);
}

main();