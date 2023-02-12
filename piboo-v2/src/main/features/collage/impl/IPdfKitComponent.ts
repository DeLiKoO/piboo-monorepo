import PDFDocument from 'pdfkit';
import CollageRendererContext from "../CollageRendererContext";

export default interface IPdfKitComponent {
    renderTo(context: CollageRendererContext, page: PDFDocument): Promise<void>;
}
