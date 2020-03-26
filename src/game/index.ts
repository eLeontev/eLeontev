import { Coordinate, direction, Enemy, State, LoaderPostion } from '../model/game.model';
import { getRadians } from '../helpers/radiant-transformer';
import { CanvasRenderer } from './renderer';
import { state } from './state';
import { createEnemy } from './calculation/enemy.calculation';
import {
    maxEnemiesCount,
    maxDelayToAddEnemyInTicks,
    maxDelayInactionsInTicks,
    changeDirectionTriesMessage,
    countOfEnemiesMessage,
    countOfChangeDirectionTriesMessageCoordintate,
    countOfEnemiesMessagePositionCoordinate
} from './constants';
import { getLoaderDataBasedOnCurrentLoaderCounterPosition } from './calculation/rest-range.calculation';

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

const hasNoEnemies = ({ enemies }: State) => !enemies.length;
const hasLessEnemiesToMax = ({ enemies }: State) => enemies.length < maxEnemiesCount;
const isDirectionCounterEmpty = ({ changeDirectionCounter }: State) => !changeDirectionCounter;

const addNewEnemy = (enemy: Enemy) => (state.enemies = [...state.enemies, enemy]);

const addNewEnemyWithPassedValidator = (
    shouldAddNewEnemyValidator: (state: State) => boolean,
    state: State,
    angle: number
) => {
    if (shouldAddNewEnemyValidator(state)) {
        addNewEnemy(createEnemy(angle, innerRadius, radius, canvasMiddlePoint));
    }
};

const updateEnemies = (angle: number) => {
    addNewEnemyWithPassedValidator(hasNoEnemies, state, angle);
    canvasRenderer.drowEnemies(state.enemies);
};

const addEnemy = (angle: number) => {
    addNewEnemyWithPassedValidator(hasLessEnemiesToMax, state, angle);
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
        state.enemies.length,
        !hasLessEnemiesToMax(state),
        countOfEnemiesMessagePositionCoordinate,
        {
            position: state.tickCounter,
            maxPosition: maxDelayToAddEnemyInTicks
        }
    );
};

const validateEnemyCounts = (angle: any) => {
    state.tickCounter = state.tickCounter + 1;

    if (state.tickCounter >= maxDelayToAddEnemyInTicks) {
        state.tickCounter = 0;
        addEnemy(angle);
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
        performPointerItaration();

        validateEnemyCounts(state.angle);
        validateTicksWithoutDestroy();
        reduceChangeDirectionCounterOnLongPending();

        updateEnemies(state.angle);
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
    if (!state.enemies.length) {
        return false;
    }

    const { angle } = state;
    const enemiesInRange = state.enemies
        .filter(({ enemyAngleRange: [min, max] }: any) => {
            const validatedAngle = angle === 360 ? 0 : angle;
            const isEnemyInRange = validatedAngle > min && validatedAngle < max;

            return isEnemyInRange;
        })
        .map(({ enemyId }: any) => enemyId);

    let isEnemyInRange = false;

    if (enemiesInRange.length) {
        state.enemies = state.enemies.filter(
            (enemy: any) => !enemiesInRange.some((enemyId: number) => enemyId === enemy.enemyId)
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
