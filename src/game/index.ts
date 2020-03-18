import { Game, MiddleCoordinate, direction } from '../model/game.model';
import { getRadians } from '../helpers/radiant-transformer';

const { clockwise, сСlockwise } = direction;
const [{ width, height }]: DOMRectList = document.body.getClientRects();
const canvasSize = width > height ? height : width;
const canvasMiddlePosition = canvasSize / 2;
const radius = canvasMiddlePosition * 0.9;

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
    canvasCtx.arc(x, y, radius / 3, 0, getRadians(360));
    canvasCtx.stroke();
};

let angle = -180;
let pointerDirection = clockwise;

const changePointerDirection = () => {
    pointerDirection = pointerDirection === clockwise ? сСlockwise : clockwise;
};

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

const setPosition = () =>
    setInterval(() => {
        setStaticFigures(ctx);
        drowPointer(angle - pointerDirection, ctx, 'white', true);
        drowPointer(angle, ctx, 'blue', false);
        angle = angle + pointerDirection;
    }, 10);

setButtonListener(changePointerDirection);
setPosition();
