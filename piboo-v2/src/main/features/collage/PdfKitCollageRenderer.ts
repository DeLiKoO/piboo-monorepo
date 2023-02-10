import { PathLike } from 'fs';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import CollageRenderer from './CollageRenderer';

export default class PdfKitCollageRenderer extends CollageRenderer {

    constructor(images: [PathLike, PathLike, PathLike]) {
        super(images);
    }

    async render(destinationPath: PathLike): Promise<string> {

        const images = this._images;
        const template = path.resolve(os.homedir(), '.config/piboo-v2/Templates/template.png');

        return new Promise((resolve, reject) => {
        // Coordinates are expressed in DTP point unit (aka PostScript point)
        // 1 dtp == 1/72 inch (72ppi) == 0.3527mm
        // 4x6 Paper Size is 288 x 432 (in dtp)
        const paperWidth = 288;
        const paperHeight = 432;

        // Page structure is as follows:

        // row height   | columns within row
        // --------------------------------------------------------------------------
        // tMargin      | *
        // boxHeight    | hMargin + boxWidth + hMargin + hMargin + boxWidth + hMargin
        // vMargin      | *
        // boxHeight    | hMargin + boxWidth + hMargin + hMargin + boxWidth + hMargin 
        // vMargin      | *
        // boxHeight    | hMargin + boxWidth + hMargin + hMargin + boxWidth + hMargin 
        // bMargin      | *

        const tMargin = 0.135*paperHeight;
        const bMargin = 0.27*paperHeight;
        const vMargin = 0.0072*paperHeight;
        const hMargin = 0.0166*paperWidth;
        
        const boxHeight = (paperHeight - tMargin - 2*vMargin - bMargin) / 3;
        const boxWidth = (paperWidth - 4*hMargin) / 2;


        console.log({
            paperHeight,
            paperWidth,
            tMargin,
            bMargin,
            vMargin,
            hMargin,
            boxHeight,
            boxWidth,
        });

        // Inside a box, there is a centered image.

        // Now, let's lay the page out :)
        const doc = new PDFDocument({autoFirstPage: false});
        const destinationFile = path.resolve(destinationPath.toString(), 'collage.pdf');
        const writeStream = fs.createWriteStream(destinationFile);
        writeStream.on("close", () => resolve(destinationFile));
        writeStream.on("error", reject);
        doc.addPage({size: [paperWidth, paperHeight], margin: 0});
        doc.pipe(writeStream);

        doc
        .image(
            images[0],
            hMargin,
            tMargin,
            {
                fit: [boxWidth, boxHeight], // fit or cover ?
                align: 'center',
                valign: 'center',
            }
        );

        doc
        .image(
            images[0],
            hMargin + boxWidth + hMargin + hMargin,
            tMargin,
            {
                fit: [boxWidth, boxHeight], // fit or cover ?
                align: 'center',
                valign: 'center',
            }
        );

        doc
        .image(
            images[1],
            hMargin,
            tMargin + boxHeight + vMargin,
            {
                fit: [boxWidth, boxHeight], // fit or cover ?
                align: 'center',
                valign: 'center',
            }
        );

        doc
        .image(
            images[1],
            hMargin + boxWidth + hMargin + hMargin,
            tMargin + boxHeight + vMargin,
            {
                fit: [boxWidth, boxHeight], // fit or cover ?
                align: 'center',
                valign: 'center',
            }
        );


        doc
        .image(
            images[2],
            hMargin,
            tMargin + 2*boxHeight + 2*vMargin,
            {
                fit: [boxWidth, boxHeight], // fit or cover ?
                align: 'center',
                valign: 'center',
            }
        );

        doc
        .image(
            images[2],
            hMargin + boxWidth + hMargin + hMargin,
            tMargin + 2*boxHeight + 2*vMargin,
            {
                fit: [boxWidth, boxHeight], // fit or cover ?
                align: 'center',
                valign: 'center',
            }
        );

        doc.image(
            template,
            0,
            0,
            {
                width: paperWidth / 2,
                height: paperHeight,
            }
        );

        doc.image(
            template,
            paperWidth / 2,
            0,
            {
                width: paperWidth / 2,
                height: paperHeight,
            }
        );

        doc.end();

        });
    }

}