const HOUR = 60 * 60;
const MINUTE = 60;

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

export const getScaleX = (
  deviceSize: { width: number; height: number },
  videoState: { fullscreen: boolean; isLandscape: boolean },
) => {
  if (videoState.fullscreen && videoState.isLandscape) {
    return deviceSize.height / deviceSize.width;
  }
  return 1;
};

export const getScaleY = (
  deviceSize: { width: number; height: number },
  videoState: { height: number; fullscreen: boolean; isLandscape: boolean },
) => {
  if (videoState.fullscreen) {
    return videoState.isLandscape
      ? deviceSize.width / videoState.height
      : deviceSize.height / videoState.height;
  }
  return 1
};
