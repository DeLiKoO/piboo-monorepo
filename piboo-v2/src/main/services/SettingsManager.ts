import { MessageClass } from "@common/Message";
import SettingsManagerMessage, { MessageType } from "@common/SettingsManagerMessage";

import * as fs from 'fs';
import * as path from 'path';

import { SETTINGS_PATH, TEMPLATES_PATH } from "../appConfig";
import YAML from 'js-yaml';
import Settings from "@common/Settings";
import Template from "@common/Template";


async function read(yamlPath) {
    const read = fs.readFileSync(yamlPath, 'utf-8');
    const parsed = YAML.load(read) as Settings;
    return parsed;
}

function ensureDirExists(dirPath: fs.PathLike) {
    if (!fs.existsSync(dirPath)) {
        throw new Error(`Templates path ('${dirPath}') is does not exist.`);
    }
}

async function listTemplates() {
    ensureDirExists(TEMPLATES_PATH);
    let list = fs.readdirSync(TEMPLATES_PATH);
    const EXT_LENGTH = 14; // .template.yaml
    list = list.filter(filename => filename.match(/.*\.template\.yaml$/));
    list = list.map(entry => entry.substring(0, entry.length - EXT_LENGTH));
    return list;
}

async function readTemplate(entry: fs.PathLike) {
    const yamlPath = path.resolve(TEMPLATES_PATH, `${entry}.template.yaml`);
    const read = fs.readFileSync(yamlPath, 'utf-8');
    const parsed = YAML.load(read) as Template;
    return parsed;
}


type SendMessageCallback = (message: SettingsManagerMessage) => Promise<void>;

export default class SettingsManager {

    private sendMessage: SendMessageCallback;

    constructor(sendMessage: SendMessageCallback) {
        this.sendMessage = sendMessage;
    }

    async handleMessage(message: SettingsManagerMessage) {
        switch (message.type) {
            case MessageType.GET_SETTINGS:
                const settings = await read(SETTINGS_PATH);
                this.sendMessage({
                    class: MessageClass.SETTINGS_MANAGER,
                    type: MessageType.SETTINGS,
                    args: { settings },
                });
                break;
            case MessageType.LIST_TEMPLATES:
                const list = await listTemplates();
                this.sendMessage({
                    class: MessageClass.SETTINGS_MANAGER,
                    type: MessageType.TEMPLATES_LIST,
                    args: { templates: list },
                });
                break;
            case MessageType.GET_TEMPLATE:
                const template = await readTemplate(message.args[0]["template"]);
                this.sendMessage({
                    class: MessageClass.SETTINGS_MANAGER,
                    type: MessageType.TEMPLATE,
                    args: { template },
                });
                break;
            default:
                throw new Error(`Unhandled type '${message.type}'`);
        }
    }

}