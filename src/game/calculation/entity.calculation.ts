import uniqueId from 'lodash.uniqueid';

import { Entity, Coordinate, entityTypes, entityProperties } from '../../model/game.model';
import { minimumEnemyOffset } from '../constants';
import { getRadians } from '../../helpers/radiant-transformer';
import { randomIntegerInRange } from '../../helpers/randomizer';

export const getRandomHelperProperty = () =>
    Math.random() > 0.5 ? entityProperties.counterIncreaser : entityProperties.exploder;

export const getEntityProperty = (type: entityTypes) => {
    const isEnemy = type === entityTypes.enemy;
    return isEnemy ? entityProperties.enemy : getRandomHelperProperty();
};

export const createEntity = (
    angle: number,
    innerRadius: number,
    radius: number,
    middlePointCoordinate: Coordinate,
    type: entityTypes
): Entity => {
    const minEnemyPosition = Math.abs(angle % 360) + minimumEnemyOffset;
    const maxEnemyPosition = minEnemyPosition + 360 - minimumEnemyOffset;

    const middlePointAngle = randomIntegerInRange(minimumEnemyOffset, maxEnemyPosition) % 360;
    const distanceFromMiddlePoint = randomIntegerInRange(innerRadius, radius * 0.9);
    const enemyRadius = randomIntegerInRange(innerRadius * 0.1, innerRadius * 0.4);

    const { x, y } = middlePointCoordinate;
    const angleRad = getRadians(middlePointAngle);
    const xPosition = distanceFromMiddlePoint * Math.sin(angleRad) + x;
    const yPosition = distanceFromMiddlePoint * Math.cos(angleRad) + y;

    const angleOffset = (Math.atan(enemyRadius / distanceFromMiddlePoint) * 180) / Math.PI;

    const min = middlePointAngle - angleOffset;
    const max = middlePointAngle + angleOffset;

    return {
        xPosition,
        yPosition,
        enemyRadius,
        middlePointAngle,
        enemyAngleRange: [min, max],
        enemyId: uniqueId('enemy-id='),
        type,
        enetityProperty: getEntityProperty(type)
    };
};
