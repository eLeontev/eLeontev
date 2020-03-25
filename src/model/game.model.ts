export interface Game {
    name: string;
    level: number;
    score: number;
}

export interface Coordinate {
    x: number;
    y: number;
}

export interface Field {
    radius: number;
    backgroundColor: number;
    middleCoordinate: Coordinate;
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

export interface Enemy {
    xPosition: number;
    yPosition: number;
    enemyRadius: number;
    middlePointAngle: number;
    enemyAngleRange: Array<number>;
    enemyId: number;
}