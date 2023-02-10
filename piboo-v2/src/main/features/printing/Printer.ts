import { PrintResult } from "@common/PrintingManagerMessage";

export default interface Printer {
    print(document: string): Promise<PrintResult>;
}
