export interface PrinterSettings {
    printerName: string,
}

export interface PrintResult {
    status: "OK" | "ERROR";
}

export default interface Printer {
    print(document: string): Promise<PrintResult>;
}
