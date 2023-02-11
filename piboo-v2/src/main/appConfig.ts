import * as path from 'path';
import * as os from 'os';

export const CAPTURE_PATH = path.resolve(os.homedir(), 'Pictures', 'PiBoo');
export const TEMPLATES_PATH = path.resolve(os.homedir(), '.config', 'piboo-v2', 'Templates');

const appConfig = {
    CAPTURE_PATH,
    TEMPLATES_PATH,
};

console.log(appConfig);

export default appConfig;