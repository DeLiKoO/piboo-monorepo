import { PathLike } from 'fs';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import CollageRenderer from './CollageRenderer';

export default class PdfKitCollageRenderer extends CollageRenderer {

    constructor(images: [PathLike, PathLike, PathLike]) {
        super(images);
    }

    async render(destinationPath: PathLike) {
        // Coordinates are expressed in DTP point unit (aka PostScript point)
        // 1 dtp == 1/72 inch (72ppi) == 0.3527mm
        // A6 Paper Size is 297.64 x 419.53 (in dtp)
        const paperWidth = 297.64;
        const paperHeight = 419.53;

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

        const tMargin = 100;
        const bMargin = 50;
        const vMargin = 10;
        const hMargin = vMargin;
        
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
        const doc = new PDFDocument({size: 'A6'});
        const destinationFile = path.resolve(destinationPath.toString(), 'collage.pdf');
        doc.pipe(fs.createWriteStream(destinationFile));

        doc
        .image(
            this._images[0],
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
            this._images[0],
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
            this._images[1],
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
            this._images[1],
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
            this._images[2],
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
            this._images[2],
            hMargin + boxWidth + hMargin + hMargin,
            tMargin + 2*boxHeight + 2*vMargin,
            {
                fit: [boxWidth, boxHeight], // fit or cover ?
                align: 'center',
                valign: 'center',
            }
        );

        doc.end();

        return destinationFile;
    }

}