import sharp from 'sharp';
import { PathLike } from 'fs';
import CollageProcessor from './CollageProcessor';
export default class SharpCollageProcessor extends CollageProcessor {

    constructor(images: [PathLike, PathLike, PathLike]) {
        super(images);
    }

    async process() {

        return sharp({
            create: {
              width: 4640,
              height: 6184,
              channels: 4,
              background: '#ffffff'
            }
          })
        .composite([
            { input: this._images[0].toString(), top: 2200, left: 200 },
            { input: this._images[1].toString(), top: 3480, left: 200 },
            { input: this._images[2].toString(), top: 4760, left: 200 },
            { input: this._images[0].toString(), top: 2200, left: 2520 },
            { input: this._images[1].toString(), top: 3480, left: 2520 },
            { input: this._images[2].toString(), top: 4760, left: 2520 },
        ])
        .png()
        .toBuffer();
    }

}