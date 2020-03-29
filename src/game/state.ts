import { startAnglePosition } from './constants';
import { State } from '../model/game.model';

export const state: State = {
    entities: [],
    tickCounter: 0,
    countOfTicksWithoutEnemyDestory: 0,
    changeDirectionCounter: 5,
    angle: startAnglePosition
};
