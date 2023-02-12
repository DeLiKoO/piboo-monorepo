import { Box } from "@common/Template";
import { IStaticImage } from "../interfaces";
import IPdfKitComponent from "./IPdfKitComponent";
import { PDFDocument } from "pdfkit";
import CollageRendererContext from "../CollageRendererContext";

export default class StaticImageComponent implements IPdfKitComponent, IStaticImage {
    constructor(
        public readonly destination: Box,
        public readonly imagePath: string,
    ) {

    }

    async renderTo(_context: CollageRendererContext, doc: PDFDocument) {
        doc
        .image(
            this.imagePath,
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