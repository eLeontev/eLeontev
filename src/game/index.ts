import { Game, MiddleCoordinate, direction } from '../model/game.model';
import { getRadians } from '../helpers/radiant-transformer';
import { randomIntegerInRange } from '../helpers/randomizer';

const { clockwise, сСlockwise } = direction;
const [{ width, height }]: DOMRectList = document.body.getClientRects();
const canvasSize = width > height ? height : width;
const canvasMiddlePosition = canvasSize / 2;
const radius = canvasMiddlePosition * 0.9;
const innerRadius = radius / 3;
const minimumEnemyOffset = 20;

const canvasMiddlePoint: MiddleCoordinate = {
    x: canvasMiddlePosition,
    y: canvasMiddlePosition
};

const { x, y } = canvasMiddlePoint;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
ctx.canvas.width = canvasSize;
ctx.canvas.height = canvasSize;
ctx.canvas.style.backgroundColor = 'white';

const setStaticFigures = (canvasCtx: CanvasRenderingContext2D) => {
    canvasCtx.beginPath();
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = 'black';
    canvasCtx.lineJoin = 'bevel';

    canvasCtx.arc(x, y, radius, 0, getRadians(360));
    canvasCtx.stroke();

    canvasCtx.beginPath();
    canvasCtx.arc(x, y, innerRadius, 0, getRadians(360));
    canvasCtx.stroke();
};

let angle = -180;
let pointerDirection = clockwise;

const setButtonListener = (listener: () => void) => {
    document.getElementById('button').addEventListener('click', listener);
};
const drowPointer = (angle: number, canvasCtx: CanvasRenderingContext2D, usedColor: string, isForClear: boolean) => {
    const angleRad = getRadians(angle);
    const xPosition = radius * Math.sin(angleRad) + x;
    const yPosition = radius * Math.cos(angleRad) + y;

    canvasCtx.beginPath();
    canvasCtx.lineWidth = isForClear ? 4 + 2 : 4;
    canvasCtx.lineJoin = 'round';
    canvasCtx.strokeStyle = usedColor;
    canvasCtx.moveTo(x, y);

    canvasCtx.lineTo(xPosition, yPosition);
    canvasCtx.stroke();
};

const cleanUpPreviosPointer = (canvasCtx: CanvasRenderingContext2D) => {
    canvasCtx.lineWidth = 4 + 2;
    canvasCtx.strokeStyle = 'white';
    canvasCtx.stroke();
};

const performPointerItaration = (canvasCtx: CanvasRenderingContext2D) => {
    cleanUpPreviosPointer(canvasCtx);
    setStaticFigures(canvasCtx);
    drowPointer(angle - pointerDirection, canvasCtx, 'white', true);
    drowPointer(angle, canvasCtx, 'blue', false);
    angle = angle + pointerDirection;
};

const calclulateEnemy = (angle: number) => {
    const minEnemyPosition = Math.abs(angle % 360) + minimumEnemyOffset;
    const maxEnemyPosition = minEnemyPosition + 360 - minimumEnemyOffset;

    // const middlePointAngle = randomIntegerInRange(minimumEnemyOffset, maxEnemyPosition);
    const middlePointAngle = 270 + 45;
    const distanceFromMiddlePoint = randomIntegerInRange(innerRadius, radius * 0.9);
    // const enemyRadius = randomIntegerInRange(innerRadius * 0.1, innerRadius * 0.4);
    const enemyRadius = innerRadius * 0.4;

    const angleRad = getRadians(middlePointAngle);
    const xPosition = distanceFromMiddlePoint * Math.sin(angleRad) + x;
    const yPosition = distanceFromMiddlePoint * Math.cos(angleRad) + y;

    const angleOffset = (Math.atan(enemyRadius / distanceFromMiddlePoint) * 180) / Math.PI;
    const enemyAngleRange = [middlePointAngle - angleOffset, middlePointAngle + angleOffset];

    console.log(Math.abs(angle))
    drowPointer(middlePointAngle - angleOffset, ctx, 'green', false)
    drowPointer(middlePointAngle, ctx, 'black', false)
    drowPointer(middlePointAngle + angleOffset, ctx, 'yellow', false)
    return {
        xPosition,
        yPosition,
        enemyRadius,
        enemyAngleRange,
        middlePointAngle,
        angleOffset
    };
};

let enemyCoords;
const drowEnemy = (angle: number, canvasCtx: CanvasRenderingContext2D) => {
    if (!enemyCoords) {
        enemyCoords = calclulateEnemy(angle);
    }

    const { xPosition, yPosition, enemyRadius } = enemyCoords;

    canvasCtx.beginPath();
    canvasCtx.strokeStyle = 'red';

    canvasCtx.arc(xPosition, yPosition, enemyRadius, 0, getRadians(360));
    canvasCtx.stroke();
};

const setPosition = () => {
    // setInterval(() => {
        const normalizedAngle = Math.abs((angle % 360));
        performPointerItaration(ctx);
        drowEnemy(angle, ctx);

    // }, 100);
};

const updateEnemyStatus = () => {
    if (!enemyCoords) {
        return;
    }

    const {
        enemyAngleRange: [min, max]
    } = enemyCoords;
    const normalizedAngle = Math.abs((angle % 360);
    console.log(enemyCoords.enemyAngleRange);

    if (normalizedAngle >= max && normalizedAngle <= min) {
        console.log('worked');
    }
};
const changePointerDirection = () => {
    pointerDirection = pointerDirection === clockwise ? сСlockwise : clockwise;
    updateEnemyStatus();
};

setButtonListener(changePointerDirection);
setPosition();
