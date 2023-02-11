import { PrinterSettings } from './PrintingManagerMessage';
import Template from './Template';

export default interface Configuration {
    
    printer: PrinterSettings;
    template: Template;

}