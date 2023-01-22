import Jimp from 'jimp';
import { PathLike } from 'fs';
import CollageProcessor from './CollageProcessor';

export default class JimpCollageProcessor extends CollageProcessor {

    constructor(images: [PathLike, PathLike, PathLike]) {
        super(images);
    }

    private async createImage(w: number, h: number, bg: string) : Promise<Jimp> {
        return new Promise((resolve, reject) => {
            new Jimp(w, h, bg, (err, image) => {
                if(err) reject(err);
                resolve(image);
            });
        });
    }

    private async loadImage(path: string) : Promise<Jimp> {
        return new Promise((resolve, reject) => {
            Jimp.read(path, (err, image) => {
                if(err) reject(err);
                resolve(image);
            });
        });
    }

    async process(): Promise<Buffer> {
        let image: Jimp = await this.createImage(4640, 6184, '#ffffff');
        image = image.composite(await this.loadImage(this._images[0].toString()), 200, 2200);
        image = image.composite(await this.loadImage(this._images[1].toString()), 200, 3480);
        image = image.composite(await this.loadImage(this._images[2].toString()), 200, 4760);
        image = image.composite(await this.loadImage(this._images[0].toString()), 2520, 2200);
        image = image.composite(await this.loadImage(this._images[1].toString()), 2520, 3480);
        image = image.composite(await this.loadImage(this._images[2].toString()), 2520, 4760);
        return image.getBufferAsync(Jimp.MIME_JPEG);
    }

}