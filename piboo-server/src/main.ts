import PrintingProcessor from "./features/printing/PrintingProcessor";

const run = async () => {
    const CAPTURE_PATH = "/home/dlk/Projects/piboo/public/.capture";
    const pp = new PrintingProcessor({ printerName: '--Canon_TS8200_series' }, CAPTURE_PATH);
    try {
        await pp.run();
    } catch(e) {
        console.log(e);
    }
}

run();
