import { PrinterSettings } from './PrintingManagerMessage';
import Template from './Template';

export default interface Settings {
    
    printer: PrinterSettings;
    template: Template;

}