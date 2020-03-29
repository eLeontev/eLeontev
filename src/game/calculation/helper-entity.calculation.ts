import { Entity, State, entityTypes, entityProperties } from '../../model/game.model';
import { changeDirectionCounterIncrement } from '../constants';

type EntityPerformerCb = (state: State) => void;
type EntitesPerformer = {
    [property in entityProperties]: EntityPerformerCb;
};

export const performExlporer = (state: State) => {
    console.log('clean up');
    state.entities = [];
};
export const performCounterIncreaser = (state: State) => {
    console.log('increment');
    state.changeDirectionCounter = state.changeDirectionCounter + changeDirectionCounterIncrement;
};

export const performEnemyFunctionality = () => {};

const entitiesPerformer: EntitesPerformer = {
    [entityProperties.exploder]: performExlporer,
    [entityProperties.counterIncreaser]: performCounterIncreaser,
    [entityProperties.enemy]: performEnemyFunctionality
};

export const performHelperFunctionality = (entites: Entity[], state: State) =>
    entites.forEach(({ enetityProperty }: Entity) => entitiesPerformer[enetityProperty](state));
