export default class Coordinates {

    constructor(
        public readonly x: number,
        public readonly y: number
    ) {

    }

    plus(other: Coordinates) {
        return new Coordinates(
            this.x + other.x, 
            this.y + other.y,
        );
    }

    minus(other: Coordinates) {
        return new Coordinates(
            this.x - other.x, 
            this.y - other.y,
        );
    }

    static between(start: Coordinates, end: Coordinates, percent: number = 0.5) {
        return new Coordinates(
            start.x + percent * (start.x - end.x), 
            start.y + percent * (start.y - end.y),
        );
    }

}