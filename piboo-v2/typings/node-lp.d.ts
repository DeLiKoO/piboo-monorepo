declare module 'node-lp' {

    interface Options {
        destination?: string,
        hostname?: string,
        port?: number,
        username?: string,
        encryption?: boolean,
        digitalCopy?: boolean,
        digitalCopyDir?: string,
        debug?: boolean,
        args?: string[],
    }
    type Job = string;
    type JobId = string;
    type PrinterCallback = (err: Error, data: Job) => void

    export {
        Options,
        Job,
        PrinterCallback,
        Printer,
    }

    class Printer {
        queueFile(fileLocation: string, callback: PrinterCallback): void;
        queue(buffer: Buffer, callback: PrinterCallback): void;
        // stop(jobid: JobId): void;
        // resume(jobid: JobId): void;
        // hold(jobid: JobId): void;
    }

    function createPrinter(options: Options): Printer;

    export default createPrinter;

}
