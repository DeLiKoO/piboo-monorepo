import Coordinates from "./Coordinates";

export default class Box {
    public readonly dimensions: Coordinates;
    constructor(
        public readonly topLeft: Coordinates,
        public readonly topRight: Coordinates,
    ) {
        this.dimensions = topRight.minus(topLeft);
    }
}