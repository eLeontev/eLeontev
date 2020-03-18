export interface Game {
    name: string;
    level: number;
    score: number;
}

export interface MiddleCoordinate {
    x: number;
    y: number;
}

export interface Field {
    radius: number;
    backgroundColor: number;
    middleCoordinate: MiddleCoordinate;
}

export enum direction {
    clockwise = -1,
    сСlockwise = 1
}

export interface Pointer {
    direction: direction;
    color: string;
    angle: number;
}

export interface Switcher {
    rootAngle: number;
    offsets: number;
}
