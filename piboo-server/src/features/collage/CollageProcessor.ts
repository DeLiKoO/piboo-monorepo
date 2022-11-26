import * as fs from 'fs';
import * as path from 'path';
import { PathLike } from 'fs';
import CollageRenderer from './CollageRenderer';

export default abstract class CollageProcessor extends CollageRenderer {
    
    constructor(images: [PathLike, PathLike, PathLike]) {
        super(images);
    }

    abstract process(): Promise<Buffer>;

    async render(destinationPath: PathLike): Promise<PathLike> {
        // Default implementation saves the processed buffer to file.
        const buf = await this.process();
        const outFilename = path.resolve(destinationPath.toString(), 'collage.jpg');
        fs.writeFileSync(outFilename, buf);
        return outFilename;
    }

}