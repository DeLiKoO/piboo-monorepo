import Coordinates from "./Coordinates";
import Box from "./Box";

export interface WithDestination {
    destination: Box;
}

export interface Capture extends WithDestination {
    seriesIndex: number; // index in the capture series to be contained in the box
}

export interface StaticImage extends WithDestination {
    imagePath: string;
}

export interface DynamicText extends WithDestination {
    templateString: string;
    cssStyle: string; // let's try and use full-blown css properties !
}

export type ComponentSpec = { capture: Capture } | { staticImage: StaticImage } | { dynamicText: DynamicText };

export interface PageSettings {
    dimensions: Coordinates;
}

export interface CollageLayout {
    page: PageSettings;
    components: Array<ComponentSpec>;
}

export interface Template {
    // name: string;
    requiredCaptures: number;
    layout: CollageLayout;
    viewfinder: string;
}


export {
    Coordinates,
    Box,
};

export default Template;