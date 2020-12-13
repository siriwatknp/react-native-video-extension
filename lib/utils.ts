import { VideoContext } from './ScreenContainer';
import { Inset } from './LayoutCalc';

const HOUR = 60 * 60;
const MINUTE = 60;
export const GUTTER_PERCENT = 5;
export const GUTTER_PX = 32;

export const isZeroInsets = (insets: Partial<Inset>) =>
  Object.entries(insets).every(([, value]) => value === 0);

const twoChar = (number: number): string =>
  Math.floor(number).toString().length === 1
    ? `0${Math.floor(number)}`
    : `${Math.floor(number)}`;

export const toTimeView = (sec: number) => {
  let secLeft = sec;
  const hr = Math.floor(sec / HOUR);
  secLeft = secLeft - hr * HOUR;
  const minute = Math.floor(secLeft / MINUTE);
  secLeft = secLeft - minute * MINUTE;
  if (hr && minute) {
    return `${hr}:${twoChar(minute)}:${twoChar(secLeft)}`;
  }
  if (hr && !minute) {
    return `${hr}:00:${twoChar(secLeft)}`;
  }
  if (minute) {
    return `${minute}:${twoChar(secLeft)}`;
  }
  return `0:${twoChar(secLeft)}`;
};

export const getSecondsToSeek = (
  duration: number,
  currentTime: number,
  seekerWidth: number,
  diffWidth: number,
  thumbRadius: number,
) => {
  const actualWidth = seekerWidth - 2 * thumbRadius;
  const result = currentTime + (diffWidth / actualWidth) * duration;
  if (result >= duration) return duration - 0.1;
  return result <= 0 ? 0.1 : result;
};

export const getThumbPosition = (
  duration: number,
  currentTime: number,
  seekerWidth: number,
  thumbRadius: number,
) => {
  if (!duration || !seekerWidth) return thumbRadius;
  const actualWidth = seekerWidth - 2 * thumbRadius;
  return (
    thumbRadius +
    (currentTime > duration ? 1 : currentTime / duration) * actualWidth
  );
};

export const getThumbTopOffset = (
  seekerThickness: number,
  thumbRadius: number,
) => {
  return -(thumbRadius * 2 - seekerThickness) / 2;
};

export const calculateRotationDegree = (
  isLandscape: boolean,
  fullscreen?: VideoContext['fullscreen'],
) => {
  if (!isLandscape) return 0;
  if (fullscreen === 'LANDSCAPE-LEFT') return 90;
  if (fullscreen === 'LANDSCAPE-RIGHT') return -90;
  return 0;
};

export type AspectRatio = 'landscape' | 'portrait' | number;
export const getAspectRatio = (ratio: AspectRatio) => {
  if (typeof ratio === 'number') return ratio;
  if (ratio === 'portrait') return 3 / 4;
  return 16 / 9;
};

// todo: remove this fn if not use
export const calculatePlayerWidth = (
  deviceSize: { width: number; height: number },
  videoState: { width: number; fullscreen: boolean; isLandscape: boolean },
) => {
  if (videoState.fullscreen) {
    return videoState.isLandscape ? deviceSize.height : deviceSize.width;
  }
  return videoState.width;
};

export const calculatePlayerHeight = (
  deviceSize: { width: number; height: number },
  videoState: { height: number; fullscreen: boolean; isLandscape: boolean },
) => {
  if (videoState.fullscreen) {
    return videoState.isLandscape ? deviceSize.width : deviceSize.height;
  }
  return videoState.height;
};
