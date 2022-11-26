import Template from '../features/collage/Template';
import Driver from '../features/camera/Driver';
import PrinterSettings from '../features/printing/PrinterSettings';

export default interface Configuration {
    
    collageTemplate: Template;
    driver: Driver;
    printer: PrinterSettings;

}