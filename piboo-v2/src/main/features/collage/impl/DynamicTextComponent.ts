import { Box } from "@common/Template";
import { IDynamicText } from "../interfaces";
import { PDFDocument } from "pdfkit";
import IPdfKitComponent from "./IPdfKitComponent";
import CollageRendererContext from "../CollageRendererContext";

export default class DynamicTextComponent implements IPdfKitComponent, IDynamicText {
    constructor(
        public readonly destination: Box,
        public readonly templateString: string,
        public readonly cssStyle: string,
    ) {

    }

    async renderTo(_context: CollageRendererContext, _doc: PDFDocument) {
        throw new Error("Method not implemented.");
    }
}