import { Entity, Coordinate, LoaderData, entityProperties } from '../model/game.model';
import { GetRadians } from '../helpers/radiant-transformer';
import {
    loaderHeight,
    loaderWidth,
    verticalLoaderOffset,
    enemyStrokeStyleColor,
    exploderStrokeStyleColor,
    counterIncreaserStrokeStyleColor
} from './constants';

type EntityPropertyColors = {
    [type in entityProperties]: string;
};
const entityPropertyColors: EntityPropertyColors = {
    [entityProperties.enemy]: enemyStrokeStyleColor,
    [entityProperties.exploder]: exploderStrokeStyleColor,
    [entityProperties.counterIncreaser]: counterIncreaserStrokeStyleColor
};

export class CanvasRenderer {
    private readonly entityPropertyColors: EntityPropertyColors = entityPropertyColors;

    private readonly defaultStartAngle: number = 0;
    private readonly defaultEndAngle: number;

    private readonly defaultLineWidth: number = 1;
    private readonly pointerLineWidth: number = 4;
    private readonly defaultLineJoin: CanvasLineJoin = 'round';

    private readonly middleXCoordinate: number;
    private readonly middleYCoordinate: number;

    private readonly defaultStrokeStyleColor: string = 'black';
    private cleanUpBackgroundColor: string = 'white';
    private enemyStrokeStyleColor: string = enemyStrokeStyleColor;
    private pointerStyleColor: string = 'blue';
    private defaultTextColor: string = 'black';

    constructor(
        private canvasCtx: CanvasRenderingContext2D,
        private radius: number,
        private innerRadius: number,
        private canvasSize: number,
        getRadians: GetRadians,
        canvasMiddlePoint: Coordinate
    ) {
        this.defaultEndAngle = getRadians(360);

        const { x, y } = canvasMiddlePoint;
        this.middleXCoordinate = x;
        this.middleYCoordinate = y;

        this.initCanvas();
    }

    public drowStaticGameField() {
        [this.radius, this.innerRadius].forEach((radius: number) => this.drowCircle(radius));
    }

    public drowEntity(
        radius: number,
        x: number,
        y: number,
        strokeStyleColor: string = this.enemyStrokeStyleColor,
        fillStyleColor?: string
    ) {
        this.drowCircle(radius, x, y, strokeStyleColor, fillStyleColor);
    }

    public canvasCleanUp() {
        this.canvasCtx.beginPath();
        this.canvasCtx.fillStyle = this.cleanUpBackgroundColor;
        this.canvasCtx.fillRect(0, 0, this.canvasSize, this.canvasSize);
    }

    public drowEntities(entities: Entity[]) {
        entities.forEach(({ xPosition, yPosition, enemyRadius, enetityProperty }: Entity) =>
            this.drowEntity(
                enemyRadius,
                xPosition,
                yPosition,
                this.entityPropertyColors[enetityProperty],
                this.entityPropertyColors[enetityProperty]
            )
        );
    }

    public drowPointer(xPosition: number, yPosition: number) {
        this.canvasCtx.beginPath();
        this.setPathView(this.pointerStyleColor, this.pointerLineWidth, this.defaultLineJoin);

        this.canvasCtx.moveTo(this.middleXCoordinate, this.middleYCoordinate);
        this.canvasCtx.lineTo(xPosition, yPosition);

        this.canvasCtx.stroke();
    }

    public drowText(
        messageWithCounter: string,
        { x, y }: Coordinate,
        specificTextColor: string | null
    ) {
        this.canvasCtx.font = '25px Arial';
        this.canvasCtx.fillStyle = specificTextColor || this.defaultTextColor;
        this.canvasCtx.fillText(messageWithCounter, x, y);
    }

    public drowLoader({ x, y }: Coordinate, { width, color }: LoaderData) {
        const yWithOffset = y + verticalLoaderOffset;

        this.canvasCtx.beginPath();
        this.canvasCtx.fillStyle = color;
        this.canvasCtx.fillRect(x, yWithOffset, width, loaderHeight);

        this.canvasCtx.beginPath();
        this.canvasCtx.strokeStyle = this.defaultStrokeStyleColor;
        this.canvasCtx.strokeRect(x, yWithOffset, loaderWidth, loaderHeight);
    }

    private drowCircle(
        radius: number,
        x: number = this.middleXCoordinate,
        y: number = this.middleYCoordinate,
        strokeStyleColor: string = this.defaultStrokeStyleColor,
        fillStyleColor?: string,
        lineWidth: number = this.defaultLineWidth,
        startAngle: number = this.defaultStartAngle,
        endAngle: number = this.defaultEndAngle,
        lineJoin: CanvasLineJoin = this.defaultLineJoin
    ) {
        this.canvasCtx.beginPath();
        this.setPathView(strokeStyleColor, lineWidth, lineJoin, fillStyleColor);

        this.canvasCtx.arc(x, y, radius, startAngle, endAngle);
        this.canvasCtx.stroke();
        this.canvasCtx.fill();
    }

    private initCanvas() {
        this.canvasCtx.canvas.width = this.canvasSize;
        this.canvasCtx.canvas.height = this.canvasSize;
        this.canvasCtx.canvas.style.backgroundColor = this.cleanUpBackgroundColor;
    }

    private setPathView(
        strokeStyleColor: string,
        lineWidth: number,
        lineJoin: CanvasLineJoin,
        fillStyleColor?: string
    ) {
        this.canvasCtx.strokeStyle = fillStyleColor
            ? this.defaultStrokeStyleColor
            : strokeStyleColor;
        this.canvasCtx.fillStyle = fillStyleColor || this.cleanUpBackgroundColor;
        this.canvasCtx.lineWidth = lineWidth;
        this.canvasCtx.lineJoin = lineJoin;
    }
}
