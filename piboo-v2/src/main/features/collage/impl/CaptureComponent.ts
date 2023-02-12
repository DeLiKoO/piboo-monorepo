import { Box } from "@common/Template";
import { ICapture } from "../interfaces";
import { PDFDocument } from "pdfkit";
import IPdfKitComponent from "./IPdfKitComponent";
import CollageRendererContext from "../CollageRendererContext";

export default class CaptureComponent implements IPdfKitComponent, ICapture {
    constructor(
        public readonly destination: Box,
        public readonly seriesIndex: number,
    ) {

    }

    async renderTo(context: CollageRendererContext, doc: PDFDocument)  {
        doc
        .image(
            context.captures[this.seriesIndex],
            this.destination.topLeft.x,
            this.destination.topLeft.y,
            {
                fit: [this.destination.dimensions.x, this.destination.dimensions.y], // fit or cover ?
                align: 'center',
                valign: 'center',
            }
        );
    }
}