import { PathLike } from 'fs';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import CollageRenderer from './CollageRenderer';
import { CollageLayout } from '@common/Template';
import pdfKitComponentFactory from './impl/pdfKitComponentFactory';
import CollageRendererContext from "./CollageRendererContext";

export default class PdfKitCollageRenderer implements CollageRenderer {
    context: CollageRendererContext;

    constructor(
        public readonly layout: CollageLayout, 
        public readonly images: [PathLike, PathLike, PathLike]) {
        this.context = {
            captures: images.map(imgPath => imgPath.toString()),
        }
    }

    async render(destinationPath: PathLike): Promise<string> {

        
        const doc = new PDFDocument({autoFirstPage: false});
        const destinationFile = path.resolve(destinationPath.toString(), 'collage.pdf');
        const writeStream = fs.createWriteStream(destinationFile);
        const result = new Promise<string>((resolve, reject) => {
            writeStream.on("close", () => resolve(destinationFile));
            writeStream.on("error", reject);
        });
        
        const paperWidth = this.layout.page.dimensions.x;
        const paperHeight = this.layout.page.dimensions.y;
        doc.addPage({size: [paperWidth, paperHeight], margin: 0});
        doc.pipe(writeStream);


        for(let componentSpec of this.layout.components) {
            const component = pdfKitComponentFactory(componentSpec);
            await component.renderTo(this.context, doc);
        }

        doc.end();

        return result;
    }

}