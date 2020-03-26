import { loaderMinColor, loaderMaxColor, loaderWidth } from '../constants';
import { LoaderData, LoaderPostion } from '../../model/game.model';

const transformHexToDec = (hex: string): number => parseInt(hex, 16);
const transformDecToHex = (dec: number): string => dec.toString(16);
const colorHexFormat = (hex: string): string => `#${hex.padStart(6, '0')}`;

const getPositionInPercents = (position: number, maxPosition: number): number =>
    position / maxPosition;
const getValueBasedOnPercentsInRange = (percentage: number, min: number, max: number): number =>
    percentage * (max - min) + min;

const [min, max] = [transformHexToDec(loaderMinColor), transformHexToDec(loaderMaxColor)];

export const getLoaderDataBasedOnCurrentLoaderCounterPosition = ({
    position,
    maxPosition
}: LoaderPostion): LoaderData => {
    const percentagesPosition = getPositionInPercents(position, maxPosition);
    const decColorPosition = getValueBasedOnPercentsInRange(percentagesPosition, min, max);

    return {
        width: percentagesPosition * loaderWidth,
        color: colorHexFormat(transformDecToHex(decColorPosition))
    };
};
