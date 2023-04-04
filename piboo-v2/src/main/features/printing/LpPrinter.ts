import Printer from "./Printer";
import { PrintResult, PrinterSettings } from "@common/PrintingManagerMessage";
import * as child_process from "child_process";

enum JobState {
    NOT_COMPLETED,
    COMPLETED,
}

const JOB_TIMEOUT_MS = 60 * 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const pexec = (command: string, args: string[]) => new Promise((resolve, reject) => {

    const process = child_process.spawn(
        command,
        args,
        {
            timeout: 10000,
        }
    )
    const chunks: string[] = [];
    process.stdout.on("data", chunk => {
        chunks.push(chunk.toString());
    });
    process.on("close", exitCode => {
        if (exitCode === 0) {
            resolve(chunks);
        } else {
            reject(new Error(`${command} exited with code ${exitCode}`));
        }
    });

});

// A printing method that uses the 'lp' command (linux)
export default class LpPrinter implements Printer {

    private settings: PrinterSettings;

    constructor(settings: PrinterSettings) {
        this.settings = settings;
    }

    async enable_printer_queue(): Promise<void> {
        await pexec("cupsenable", [this.settings.printerName]);
    }

    // returns promise of a job-id
    async start_print_job(filename: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const { settings } = this;
            const { printerName, printerOptions } = settings;
            const lpArgs: string[] = [];
            lpArgs.push("-d", printerName);
            for (const [key, value] of Object.entries(printerOptions)) {
                lpArgs.push("-o");
                lpArgs.push(`${key}=${value}`);
            }
            lpArgs.push("--", filename);
            console.debug("lpArgs:", lpArgs);
            const process = child_process.spawn(
                "lp",
                lpArgs,
                {
                    timeout: 10000,
                }
            )

            const chunks: string[] = [];
            process.stdout.on("data", chunk => {
                chunks.push(chunk.toString());
            });
            process.on("close", exitCode => {
                if (exitCode === 0) {
                    const stdout = chunks.join("");
                    const lines = stdout.split(/\n/);
                    for (let line of lines) {
                        const match = line.match(/request id is ([^\s]+)/);
                        if (match !== null && match.length > 1) {
                            const jobId = match[1];
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

    async cancel_print_job(jobId: string): Promise<void> {
        await pexec("cancel", ["-a", jobId]);
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
                if (exitCode === 0) {
                    const stdout = chunks.join("");
                    const lines = stdout.split(/\n/);
                    const entries = lines.map(entry => entry.replaceAll(/\s+/g, ";").split(';'));
                    const matching = entries.filter(e => e[0] === jobId);
                    if (matching.length > 0) {
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
        const sentAt = Date.now();
        do {
            await sleep(250);
            jobState = await this.check_print_job(jobId);
            const now = Date.now();
            if (now - sentAt > JOB_TIMEOUT_MS) {
                this.cancel_print_job(jobId);
                await sleep(1000);
                this.enable_printer_queue();
                break;
            }
        } while (jobState !== JobState.COMPLETED);

        return { status: jobState === JobState.COMPLETED ? 'OK' : 'ERROR' };
    }
}
