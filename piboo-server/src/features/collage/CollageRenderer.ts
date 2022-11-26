import * as fs from 'fs';
import * as path from 'path';
import { PathLike } from 'fs';

export default abstract class CollageRenderer {
    
    protected _images: [PathLike, PathLike, PathLike];

    constructor(images: [PathLike, PathLike, PathLike]) {
        this._images = images;
    }

    abstract render(destinationPath: PathLike): Promise<PathLike>;

}