import * as path from 'path';
import * as os from 'os';

export const CAPTURE_PATH = path.resolve(os.homedir(), 'Pictures', 'PiBoo');
console.log({CAPTURE_PATH});