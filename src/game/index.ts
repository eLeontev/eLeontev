import {
    Coordinate,
    direction,
    Entity,
    State,
    LoaderPostion,
    entityTypes
} from '../model/game.model';
import { getRadians } from '../helpers/radiant-transformer';
import { CanvasRenderer } from './renderer';
import { state } from './state';

import {
    maxEnemiesCount,
    maxDelayToAddEnemyInTicks,
    maxDelayInactionsInTicks,
    changeDirectionTriesMessage,
    countOfEnemiesMessage,
    countOfChangeDirectionTriesMessageCoordintate,
    countOfEnemiesMessagePositionCoordinate,
    helperGeneratorChance
} from './constants';
import { getLoaderDataBasedOnCurrentLoaderCounterPosition } from './calculation/rest-range.calculation';
import { createEntity } from './calculation/entity.calculation';
import { performHelperFunctionality } from './calculation/helper-entity.calculation';

const { clockwise, сСlockwise } = direction;
const domRectList = document.body.getClientRects();
const { width, height } = domRectList[0];

const canvasSize = width > height ? height : width;
const canvasMiddlePosition = canvasSize / 2;
const radius = canvasMiddlePosition * 0.9;
const innerRadius = radius / 3;

const canvasMiddlePoint: Coordinate = {
    x: canvasMiddlePosition,
    y: canvasMiddlePosition
};

const { x, y } = canvasMiddlePoint;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const canvasRenderer = new CanvasRenderer(
    ctx,
    radius,
    innerRadius,
    canvasSize,
    getRadians,
    canvasMiddlePoint
);

let pointerDirection = clockwise;

const setDocumentListener = (listener: () => void) => {
    document.addEventListener('click', listener);
    document.addEventListener('keydown', listener);
};
const drowPointer = (angle: number) => {
    const angleRad = getRadians(angle);
    const xPosition = radius * Math.sin(angleRad) + x;
    const yPosition = radius * Math.cos(angleRad) + y;

    canvasRenderer.drowPointer(xPosition, yPosition);
};

const getUpdatedAngle = (updatedAngle: number, direction: number) => {
    return direction === clockwise
        ? updatedAngle <= 0
            ? 360
            : updatedAngle
        : updatedAngle >= 360
        ? 0
        : updatedAngle;
};

const performPointerItaration = () => {
    const { angle } = state;
    drowPointer(state.angle);
    state.angle = getUpdatedAngle(angle + pointerDirection, pointerDirection);
};

const hasNoEnemies = ({ entities }: State) =>
    !entities.find(({ type }: Entity) => type === entityTypes.enemy);
const hasLessEnemiesToMax = ({ entities }: State) => entities.length < maxEnemiesCount;
const isDirectionCounterEmpty = ({ changeDirectionCounter }: State) => !changeDirectionCounter;

const addNewEnemy = (entity: Entity) => (state.entities = [...state.entities, entity]);

type GetRandomEntityType = () => entityTypes;
const getRandomEntityType: GetRandomEntityType = () =>
    Math.random() > helperGeneratorChance ? entityTypes.enemy : entityTypes.helper;

const addNewEntityWithPassedValidator = (
    shouldAddNewEnemyValidator: (state: State) => boolean,
    state: State,
    angle: number,
    type: entityTypes
) => {
    if (shouldAddNewEnemyValidator(state)) {
        addNewEnemy(createEntity(angle, innerRadius, radius, canvasMiddlePoint, type));
    }
};

const updateEntities = (angle: number, type: entityTypes) => {
    addNewEntityWithPassedValidator(hasNoEnemies, state, angle, type);
    canvasRenderer.drowEntities(state.entities);
};

const addEntity = (angle: number, type: entityTypes) => {
    addNewEntityWithPassedValidator(hasLessEnemiesToMax, state, angle, type);
};

const drowCounterMessageWithLoader = (
    staticPrefixMessage: string,
    dynamicValue: number,
    useSpecificColor: boolean,
    textPositionCoordintate: Coordinate,
    loaderPosition: LoaderPostion
) => {
    const messageWithCounter = `${staticPrefixMessage} ${dynamicValue}`;
    const specificTextColor = useSpecificColor ? 'red' : null;

    canvasRenderer.drowText(messageWithCounter, textPositionCoordintate, specificTextColor);
    canvasRenderer.drowLoader(
        textPositionCoordintate,
        getLoaderDataBasedOnCurrentLoaderCounterPosition(loaderPosition)
    );
};

const drowTextMessagesWithLoader = (state: State) => {
    drowCounterMessageWithLoader(
        changeDirectionTriesMessage,
        state.changeDirectionCounter,
        isDirectionCounterEmpty(state),
        countOfChangeDirectionTriesMessageCoordintate,
        {
            position: state.countOfTicksWithoutEnemyDestory,
            maxPosition: maxDelayInactionsInTicks
        }
    );
    drowCounterMessageWithLoader(
        countOfEnemiesMessage,
        state.entities.length,
        !hasLessEnemiesToMax(state),
        countOfEnemiesMessagePositionCoordinate,
        {
            position: state.tickCounter,
            maxPosition: maxDelayToAddEnemyInTicks
        }
    );
};

const validateEntitiesCounts = (angle: any, getRandomEntityType: GetRandomEntityType) => {
    state.tickCounter = state.tickCounter + 1;

    if (state.tickCounter >= maxDelayToAddEnemyInTicks) {
        state.tickCounter = 0;
        addEntity(angle, getRandomEntityType());
    }
};

const validateTicksWithoutDestroy = () => {
    state.countOfTicksWithoutEnemyDestory = state.countOfTicksWithoutEnemyDestory + 1;
};

const cleanUpTicksWithoutEnemyDestroy = (isEnemyInRange: boolean) => {
    if (isEnemyInRange) {
        state.countOfTicksWithoutEnemyDestory = 0;
    }
};

const updateChangeDirectionCounter = (diff: number) => {
    state.changeDirectionCounter = state.changeDirectionCounter + diff;

    if (state.changeDirectionCounter < 0) {
        state.changeDirectionCounter = 0;
    }
};

const reduceChangeDirectionCounterOnLongPending = () => {
    if (state.countOfTicksWithoutEnemyDestory > maxDelayInactionsInTicks) {
        cleanUpTicksWithoutEnemyDestroy(true);
        updateChangeDirectionCounter(-1);
    }
};

const startGame = () => {
    setInterval(() => {
        canvasRenderer.canvasCleanUp();
        canvasRenderer.drowStaticGameField();

        validateEntitiesCounts(state.angle, getRandomEntityType);
        validateTicksWithoutDestroy();
        reduceChangeDirectionCounterOnLongPending();

        updateEntities(state.angle, entityTypes.enemy);

        performPointerItaration();

        drowTextMessagesWithLoader(state);
    }, 10);
};

const validateChangeDirectionCounter = (isEnemyInRange: boolean) => {
    const { changeDirectionCounter } = state;
    const shouldNotReduceCounter = !isEnemyInRange && changeDirectionCounter === 0;

    if (shouldNotReduceCounter) {
        return;
    }

    const diff = isEnemyInRange ? 1 : -1;
    updateChangeDirectionCounter(diff);
};

const getUpdatedEnemyStatus = () => {
    if (!state.entities.length) {
        return false;
    }

    const { angle } = state;
    const enemiesInRange = state.entities.filter(({ enemyAngleRange: [min, max] }: any) => {
        const validatedAngle = angle === 360 ? 0 : angle;
        const isEnemyInRange = validatedAngle > min && validatedAngle < max;

        return isEnemyInRange;
    });
    const enemiedIfInRange = enemiesInRange.map(({ enemyId }: any) => enemyId);

    let isEnemyInRange = false;

    performHelperFunctionality(enemiesInRange, state);

    if (enemiesInRange.length) {
        state.entities = state.entities.filter(
            (enemy: any) => !enemiedIfInRange.some((enemyId: number) => enemyId === enemy.enemyId)
        );

        isEnemyInRange = true;
    }

    return isEnemyInRange;
};

const changePointerDirection = () => {
    const isEnemyInRange = getUpdatedEnemyStatus();
    const { changeDirectionCounter } = state;
    if (changeDirectionCounter || isEnemyInRange) {
        pointerDirection = pointerDirection === clockwise ? сСlockwise : clockwise;
    }

    cleanUpTicksWithoutEnemyDestroy(isEnemyInRange);
    validateChangeDirectionCounter(isEnemyInRange);
};

let isGameStarted: boolean = false;
const addListenerToStartGame = (listener: () => void) => {
    const button = document.getElementById('button');

    if (!button) {
        return;
    }

    button.addEventListener('keydown', event => event.preventDefault());
    button.addEventListener('click', () => {
        if (!isGameStarted) {
            isGameStarted = true;
            listener();
            document.body.focus();
        }
    });
};
setDocumentListener(changePointerDirection);

addListenerToStartGame(startGame);
