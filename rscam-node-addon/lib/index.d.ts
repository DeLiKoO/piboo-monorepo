declare module "rscam-node-addon" {

    export class Webcam {
        constructor(path: string);
        capture(): ArrayBuffer;
    }

}
