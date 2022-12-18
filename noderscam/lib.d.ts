declare module "noderscam" {

    export class Webcam {
        constructor(path: string);
        capture(): ArrayBuffer;
    }

}
