import { MessageClass } from "@common/Message";
import TemplateManagerMessage, { MessageType } from "@common/TemplateManagerMessage";

import * as fs from 'fs';
import * as path from 'path';

import { TEMPLATES_PATH } from "../../appConfig";
import YAML from 'js-yaml';
import Template from "@common/Template";

function ensureDirExists(dirPath: fs.PathLike) {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Templates path ('${dirPath}') is does not exist.`);
  }
}

async function listEntries(dirPath: fs.PathLike) {
  ensureDirExists(dirPath);
  let list = fs.readdirSync(dirPath);
  const EXT_LENGTH = 14; // .template.yaml
  list = list.filter(filename => filename.match(/.*\.template\.yaml$/));
  list = list.map(entry => entry.substring(0, entry.length - EXT_LENGTH));
  return list;
}

async function readEntry(entry: fs.PathLike) {
  const yamlPath = path.resolve(TEMPLATES_PATH, `${entry}.template.yaml`);
  const read = fs.readFileSync(yamlPath, 'utf-8');
  const parsed = YAML.load(read) as Template;
  return parsed;
}

type SendMessageCallback = (message: TemplateManagerMessage) => Promise<void>;

export default class TemplateManager {

  private sendMessage: SendMessageCallback;

  constructor(sendMessage: SendMessageCallback) {
      this.sendMessage = sendMessage;
  }

  async handleMessage(message: TemplateManagerMessage) {
      switch (message.type) {
          case MessageType.LIST_TEMPLATES:
              const entries = await listEntries(TEMPLATES_PATH);
              const templates = entries.map(async e => [e, await readEntry(e)]);
              this.sendMessage({
                  class: MessageClass.TEMPLATE_MANAGER,
                  type: MessageType.TEMPLATES_LIST,
                  args: {templates},
              });
              break;
          default:
              throw new Error(`Unhandled type '${message.type}'`);
      }
  }

}