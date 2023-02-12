import { PathLike } from 'fs';

export default interface CollageRenderer {
    
    render(destinationPath: PathLike): Promise<PathLike>;

}