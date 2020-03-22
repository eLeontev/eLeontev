import { MiddleCoordinate, direction } from '../model/game.model';
import { getRadians } from '../helpers/radiant-transformer';
import { randomIntegerInRange } from '../helpers/randomizer';

const { clockwise, сСlockwise } = direction;
const domRectList = document.body.getClientRects();
const { width, height } = domRectList[0];

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
let angle = 179;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
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

let pointerDirection = clockwise;

const setDocumentListener = (listener: () => void) => {
    document.addEventListener('click', listener);
    document.addEventListener('keydown', listener);
};
const drowPointer = (angle: number, canvasCtx: CanvasRenderingContext2D, usedColor: string) => {
    const angleRad = getRadians(angle);
    const xPosition = radius * Math.sin(angleRad) + x;
    const yPosition = radius * Math.cos(angleRad) + y;

    canvasCtx.beginPath();
    canvasCtx.lineWidth = 4;
    canvasCtx.lineJoin = 'round';
    canvasCtx.strokeStyle = usedColor;
    canvasCtx.moveTo(x, y);

    canvasCtx.lineTo(xPosition, yPosition);
    canvasCtx.stroke();
};

const getUpdatedAngle = (updatedAngle: number, direction: number) => {
    return direction === clockwise ? (updatedAngle <= 0 ? 360 : updatedAngle) : updatedAngle >= 360 ? 0 : updatedAngle;
};

const performPointerItaration = (canvasCtx: CanvasRenderingContext2D) => {
    drowPointer(angle, canvasCtx, 'blue');
    angle = getUpdatedAngle(angle + pointerDirection, pointerDirection);
};

const calclulateEnemy = (angle: number) => {
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

    return {
        xPosition,
        yPosition,
        enemyRadius,
        middlePointAngle,
        enemyAngleRange: [min, max]
    };
};

let enemyCoords: any;
const drowEnemy = (angle: number, canvasCtx: CanvasRenderingContext2D) => {
    if (!enemyCoords) {
        enemyCoords = calclulateEnemy(angle);
    }

    const { xPosition, yPosition, enemyRadius } = enemyCoords;

    canvasCtx.beginPath();
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = 'red';

    canvasCtx.arc(xPosition, yPosition, enemyRadius, 0, getRadians(360));
    canvasCtx.stroke();
};

const performCleanUp = (canvasCtx: CanvasRenderingContext2D) => {
    canvasCtx.beginPath();
    canvasCtx.fillStyle = 'white';
    canvasCtx.fillRect(0, 0, canvasSize, canvasSize);
};

const startGame = () => {
    setInterval(() => {
        performCleanUp(ctx);
        setStaticFigures(ctx);
        performPointerItaration(ctx);
        drowEnemy(angle, ctx);
    }, 10);
};

const updateEnemyStatus = () => {
    if (!enemyCoords) {
        return;
    }

    const {
        enemyAngleRange: [min, max]
    } = enemyCoords;

    const validatedAngle = angle === 360 ? 0 : angle;
    const isEnemyInRange = validatedAngle > min && validatedAngle < max;

    if (isEnemyInRange) {
        enemyCoords = null;
    }
};
const changePointerDirection = () => {
    pointerDirection = pointerDirection === clockwise ? сСlockwise : clockwise;
    updateEnemyStatus();
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
