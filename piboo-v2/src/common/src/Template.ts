// Expressed in points (72 points = 1 inch)
export interface Coordinates {
    x: number,
    y: number,
}

export interface Box {
    topLeft: Coordinates;
    topRight: Coordinates;
}

export interface Renderable {
    container: Box;
}

export interface Capture extends Renderable {
    seriesIndex: number; // index in the capture series to be contained in the box
}

export interface StaticImage extends Renderable {
    imagePath: string;
}

export interface DynamicText extends Renderable {
    templateString: string;
    cssStyle: string; // let's try and use full-blown css properties !
}

export interface CollageLayout {
    renderables: Array<Renderable>;
}

export interface Template {
    // name: string;
    requiredCaptures: number;
    layout: CollageLayout;
    viewfinder: string;
}


export default Template;