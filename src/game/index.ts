import { Coordinate, direction, Enemy } from '../model/game.model';
import { getRadians } from '../helpers/radiant-transformer';
import { randomIntegerInRange } from '../helpers/randomizer';
import { CanvasRenderer } from './renderer';

const state: any = {
    enemies: [],
    tickCounter: 0,
    countOfTicksWithoutEnemyDestory: 0,
    changeDirectionCounter: 5
};

const { clockwise, сСlockwise } = direction;
const domRectList = document.body.getClientRects();
const { width, height } = domRectList[0];

const canvasSize = width > height ? height : width;
const canvasMiddlePosition = canvasSize / 2;
const radius = canvasMiddlePosition * 0.9;
const innerRadius = radius / 3;
const minimumEnemyOffset = 20;

const canvasMiddlePoint: Coordinate = {
    x: canvasMiddlePosition,
    y: canvasMiddlePosition
};

const { x, y } = canvasMiddlePoint;
let angle = 179;

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
    drowPointer(angle);
    angle = getUpdatedAngle(angle + pointerDirection, pointerDirection);
};

let incrementId = -1;

const calclulateEnemy = (angle: number): Enemy => {
    const minEnemyPosition = Math.abs(angle % 360) + minimumEnemyOffset;
    const maxEnemyPosition = minEnemyPosition + 360 - minimumEnemyOffset;

    const middlePointAngle = randomIntegerInRange(minimumEnemyOffset, maxEnemyPosition) % 360;
    const distanceFromMiddlePoint = randomIntegerInRange(innerRadius, radius * 0.9);
    const enemyRadius = randomIntegerInRange(innerRadius * 0.1, innerRadius * 0.4);

    const angleRad = getRadians(middlePointAngle);
    const xPosition = distanceFromMiddlePoint * Math.sin(angleRad) + x;
    const yPosition = distanceFromMiddlePoint * Math.cos(angleRad) + y;

    const angleOffset = (Math.atan(enemyRadius / distanceFromMiddlePoint) * 180) / Math.PI;

    const min = middlePointAngle - angleOffset;
    const max = middlePointAngle + angleOffset;

    incrementId = incrementId + 1;

    return {
        xPosition,
        yPosition,
        enemyRadius,
        middlePointAngle,
        enemyAngleRange: [min, max],
        enemyId: incrementId
    };
};

const updateEnemies = (angle: number) => {
    if (!state.enemies.length) {
        state.enemies.push(calclulateEnemy(angle));
    }

    canvasRenderer.drowEnemies(state.enemies);
};

const addEnemy = (angle: number) => {
    if (state.enemies.length < 10) {
        state.enemies.push(calclulateEnemy(angle));
    }
};

const drowChangeDirectionCounter = () => {
    const { changeDirectionCounter } = state;
    const messageWithCounter = `change direction tries: ${changeDirectionCounter}`;
    const specificTextColor = !changeDirectionCounter ? 'red' : null;

    canvasRenderer.drowText(messageWithCounter, { x: 10, y: 40 }, specificTextColor);
};

const validateEnemyCounts = (angle: any) => {
    state.tickCounter = state.tickCounter + 1;

    if (state.tickCounter >= 180) {
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
    if (state.countOfTicksWithoutEnemyDestory > 90) {
        cleanUpTicksWithoutEnemyDestroy(true);
        updateChangeDirectionCounter(-1);
    }
};

const startGame = () => {
    setInterval(() => {
        canvasRenderer.canvasCleanUp();
        canvasRenderer.drowStaticGameField();
        performPointerItaration();

        validateEnemyCounts(angle);
        validateTicksWithoutDestroy();
        reduceChangeDirectionCounterOnLongPending();

        updateEnemies(angle);
        drowChangeDirectionCounter();
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
