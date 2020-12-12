import {
  AspectRatio,
  calculateRotationDegree,
  getAspectRatio,
  GUTTER_PERCENT,
  GUTTER_PX,
  isZeroInsets,
} from './utils';
import { VideoContext } from './ScreenContainer';

interface WindowDimension {
  width: number;
  height: number;
}

export interface Inset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

type Info = {
  insets?: Inset;
  fullscreen: boolean;
  isLandscape: boolean;
};

export const OrientationLocker = new (class OrientationLocker {
  isPortraitLocked: boolean;
  constructor() {
    this.isPortraitLocked = false;
  }
})();

export const Device = ({ width, height }: WindowDimension) => {
  const isLandscape = width > height;
  if (OrientationLocker.isPortraitLocked) {
    return {
      width,
      height,
    };
  }
  return {
    width: isLandscape ? height : width,
    height: isLandscape ? width : height,
  };
};

export const Gap = ({ insets, fullscreen, isLandscape }: Info) => {
  if (!fullscreen || !insets || (insets && isZeroInsets(insets))) {
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
  }
  if (OrientationLocker.isPortraitLocked) {
    if (isLandscape) {
      return {
        left: insets.top > 20 ? insets.top : 0,
        right: insets.bottom,
        top: 0,
        bottom: 0,
      };
    }
    return {
      left: 0,
      right: 0,
      top: insets.top > 20 ? insets.top : 0,
      bottom: insets.bottom,
    };
  }
  return {
    left: insets.left,
    right: insets.right,
    top: insets.top,
    bottom: insets.bottom,
  };
};

export const getPlayerWidth = (windowSize: WindowDimension, info: Info) => {
  const gap = Gap(info);
  const device = Device(windowSize);
  const { isLandscape, fullscreen } = info;
  return isLandscape && fullscreen
    ? device.height - gap.left - gap.right
    : device.width;
};

export const getPlayerHeight = (
  windowSize: WindowDimension,
  info: Info & { aspectRatio: AspectRatio },
) => {
  const gap = Gap(info);
  const device = Device(windowSize);
  const { isLandscape, fullscreen, aspectRatio } = info;
  if (fullscreen) {
    return isLandscape ? device.width : device.height - gap.top - gap.bottom;
  }
  return device.width / getAspectRatio(aspectRatio);
};

export const getPlayerSize = (
  windowSize: WindowDimension,
  info: Info & { aspectRatio: AspectRatio },
) => {
  const gap = Gap(info);
  const width = getPlayerWidth(windowSize, info);
  const height = getPlayerHeight(windowSize, info);
  const { isLandscape, fullscreen } = info;
  return {
    width,
    height,
    marginTop: fullscreen && !isLandscape ? gap.top : 0,
    marginLeft: fullscreen && isLandscape ? (gap.left + gap.right) / 2 : 0,
  };
};

export const getPlayerRotationDegree = (
  windowSize: WindowDimension,
  info: { isLandscape: boolean; fullscreen: VideoContext['fullscreen'] },
) => {
  const { fullscreen, isLandscape } = info;
  if (!fullscreen) {
    return 0;
  }
  if (OrientationLocker.isPortraitLocked) {
    return calculateRotationDegree(isLandscape, fullscreen);
  }
  if (isLandscape) {
    return windowSize.height > windowSize.width ? 90 : 0;
  }
  return windowSize.height > windowSize.width ? 0 : 90;
};

export const getSeekerWidth = (
  windowSize: WindowDimension,
  { insets, fullscreen, isLandscape }: Info,
) => {
  const device = Device(windowSize);
  if (fullscreen) {
    if (!isLandscape) return device.width - GUTTER_PX * 2;
    if (!insets) return `${100 - GUTTER_PERCENT * 2}%`;
    if (isZeroInsets(insets)) return device.height - GUTTER_PX * 2;
    return '100%';
  }
  return '100%';
};

export const getSeekerLayout = (windowSize: WindowDimension, info: Info) => {
  const { insets, fullscreen, isLandscape } = info;
  const width = getSeekerWidth(windowSize, info);
  if (!fullscreen) {
    return { width };
  }
  if (!isLandscape) return { width, marginLeft: GUTTER_PX };
  if (!insets) return { width, marginLeft: `${GUTTER_PERCENT}%` };
  if (isZeroInsets(insets)) return { width, marginLeft: GUTTER_PX };
  return { width };
};
