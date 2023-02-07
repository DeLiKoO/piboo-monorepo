import Printer, { PrintResult, PrinterSettings } from "./Printer";
import * as child_process from "child_process";

enum JobState {
    NOT_COMPLETED,
    COMPLETED,
} 

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));    

// A printing method that uses the 'lp' command (linux)
export default class LpPrinter implements Printer {

    private settings: PrinterSettings;

    constructor(settings: PrinterSettings) {
        this.settings = settings;
    }

    // returns promise of a job-id
    async start_print_job(filename: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const process = child_process.spawn(
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
    
            const chunks: string[] = [];
            process.stdout.on("data", chunk => {
                chunks.push(chunk.toString());
            });
            process.on("close", exitCode => {
                if(exitCode === 0) {
                    const stdout = chunks.join("");
                    console.debug("stdout:", stdout);
                    const lines = stdout.split(/\n/);
                    for(let line of lines) {
                        console.debug("line:", line);
                        const match = line.match(/request id is ([^\s]+)/);
                        console.debug("match:", match);
                        if(match !== null && match.length > 1) {
                            const jobId = match[1];
                            console.debug("jobId:", jobId);
                            resolve(jobId);
                            return;
                        }
                    }
                    reject(new Error(`lp did not provide a request id`));
                } else {
                    reject(new Error(`lp exited with code ${exitCode}`));
                }
            });
        });
    }

    async check_print_job(jobId: string): Promise<JobState> {
        return new Promise((resolve, reject) => {
            const process = child_process.spawn(
                "lpstat",
                [
                    "-o", this.settings.printerName,
                ],
                {
                    timeout: 10000,
                }
            )

            const chunks: string[] = [];
            process.stdout.on("data", chunk => {
                chunks.push(chunk.toString());
            });
            process.on("close", exitCode => {
                if(exitCode === 0) {
                    const stdout = chunks.join("");
                    console.debug("stdout:", stdout);
                    const lines = stdout.split(/\n/);
                    const entries = lines.map(entry => entry.replaceAll(/\s+/g, ";").split(';'));
                    console.debug("entries:", entries);
                    const matching = entries.filter(e => e[0] === jobId);
                    console.debug("matching:", matching);
                    if(matching.length > 0) {
                        resolve(JobState.NOT_COMPLETED);
                    } else {
                        resolve(JobState.COMPLETED);
                    }
                } else {
                    reject(new Error(`lp exited with code ${exitCode}`));
                }
            });
        });
    }

    async print(filename: string): Promise<PrintResult> {
        const jobId = await this.start_print_job(filename);
        let jobState: JobState = JobState.NOT_COMPLETED;
        do {
            await sleep(250);
            jobState = await this.check_print_job(jobId);
        } while (jobState !== JobState.COMPLETED);

        return { status: 'OK'};
    }
}