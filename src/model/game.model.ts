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

export enum entityTypes {
    enemy = 'enemy',
    helper = 'helper'
}

export enum entityProperties {
    enemy = 'enemy',
    exploder = 'exploder',
    counterIncreaser = 'counterIncreaser'
}

export interface Entity {
    type: entityTypes;
    enetityProperty: entityProperties;
    xPosition: number;
    yPosition: number;
    enemyRadius: number;
    middlePointAngle: number;
    enemyAngleRange: Array<number>;
    enemyId: number;
}

export interface State {
    entities: Array<Entity>;
    tickCounter: number;
    countOfTicksWithoutEnemyDestory: number;
    changeDirectionCounter: number;
    angle: number;
}

export interface LoaderData {
    width: number;
    color: string;
}

export interface LoaderPostion {
    position: number;
    maxPosition: number;
}
