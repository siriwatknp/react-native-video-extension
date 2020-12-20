import { Dimensions } from 'react-native';
import {
  AspectRatio,
  calculateRotationDegree,
  getAspectRatio,
  GUTTER_PERCENT,
  GUTTER_PX,
  isZeroInsets,
} from './utils';
import {FullscreenOrientation, VideoContext} from './ScreenContainer';

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
  const { isLandscape: isLandscapeVideo, fullscreen } = info;
  if (OrientationLocker.isPortraitLocked) {
    return isLandscapeVideo && fullscreen
      ? device.height - gap.left - gap.right
      : device.width;
  }
  if (fullscreen) {
    const isLandscapeDevice = windowSize.width > windowSize.height;
    if (isLandscapeDevice) {
      return isLandscapeVideo
        ? device.height - gap.left - gap.right
        : device.width;
    }
    return isLandscapeVideo
      ? device.height - gap.top - gap.bottom
      : device.width;
  }
  return windowSize.width;
};

export const getPlayerHeight = (
  windowSize: WindowDimension,
  info: Info & { aspectRatio: AspectRatio },
) => {
  const gap = Gap(info);
  const device = Device(windowSize);
  const { isLandscape, fullscreen, aspectRatio } = info;
  const isLandscapeDevice = windowSize.width > windowSize.height;
  if (OrientationLocker.isPortraitLocked) {
    if (fullscreen) {
      return isLandscape ? device.width : device.height - gap.top - gap.bottom;
    }
    return device.width / getAspectRatio(aspectRatio);
  }
  if (fullscreen) {
    if (isLandscapeDevice && !isLandscape) {
      return device.height - gap.left - gap.right;
    }
    return isLandscape ? device.width : device.height - gap.top - gap.bottom;
  }
  return windowSize.width / getAspectRatio(aspectRatio);
};

export const getPlayerSize = (
  windowSize: WindowDimension,
  info: Info & { aspectRatio: AspectRatio },
) => {
  const width = getPlayerWidth(windowSize, info);
  const height = getPlayerHeight(windowSize, info);
  return {
    width,
    height,
    ...getPlayerMargin(windowSize, info),
  };
};

export const getPlayerMargin = (windowSize: WindowDimension, info: Info) => {
  const { fullscreen, isLandscape } = info;
  const isLandscapeDevice = windowSize.width > windowSize.height;
  const gap = Gap(info);
  if (OrientationLocker.isPortraitLocked) {
    return {
      marginTop: fullscreen && !isLandscape ? gap.top : 0,
      marginLeft: fullscreen && isLandscape ? (gap.left + gap.right) / 2 : 0,
    };
  }
  if (fullscreen) {
    if (isLandscapeDevice) {
      return {
        marginTop: !isLandscape ? (gap.left + gap.right) / 2 : 0,
        marginLeft: isLandscape ? (gap.left + gap.right) / 2 : 0,
      };
    }
    return {
      marginTop: !isLandscape ? (gap.top + gap.bottom) / 2 : 0,
      marginLeft: isLandscape ? (gap.top + gap.bottom) / 2 : 0,
    };
  }
  return {};
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

export const getPlayerTranslate2D = (
  windowSize: WindowDimension,
  info: Pick<Info, 'fullscreen' | 'isLandscape'>,
) => {
  const device = Device(windowSize);
  const { isLandscape: isLandscapeVideo, fullscreen } = info;
  const shouldRotate = isLandscapeVideo && fullscreen;
  const offset = (device.height - device.width) / 2;
  if (OrientationLocker.isPortraitLocked) {
    return [
      { translateY: shouldRotate ? offset : 0 },
      { translateX: shouldRotate ? -offset : 0 },
    ];
  }
  if (fullscreen) {
    const isLandscapeDevice = windowSize.width > windowSize.height;
    if (isLandscapeDevice) {
      return [
        { translateY: isLandscapeVideo ? 0 : -offset },
        { translateX: isLandscapeVideo ? 0 : offset },
      ];
    }
    return [
      { translateY: isLandscapeVideo ? offset : 0 },
      { translateX: isLandscapeVideo ? -offset : 0 },
    ];
  }
  return [];
};

export const getAutoFitSeekDiff = (
  fullscreen: boolean,
  isLandscapeVideo: boolean,
) => {
  const { width, height } = Dimensions.get('window');
  if (fullscreen) {
    if (OrientationLocker.isPortraitLocked) {
      return isLandscapeVideo ? 'dy' : 'dx';
    }
    if (width > height) {
      // isLandscapeDevice
      return isLandscapeVideo ? 'dx' : 'dy';
    } else {
      // isPortraitDevice
      return isLandscapeVideo ? 'dy' : 'dx';
    }
  }
  return 'dx';
};

export const getContainSeekDiff = (fullscreen: VideoContext['fullscreen']) => {
  const { width, height } = Dimensions.get('window');
  if (fullscreen) {
    if (OrientationLocker.isPortraitLocked) {
      return fullscreen === 'PORTRAIT' ? 'dx' : 'dy';
    }
    if (width > height) {
      // isLandscapeDevice
      return 'dy';
    }
  }
  return 'dx';
};

export const getSeekerOffset = (info: Info) => {
  const { insets, fullscreen, isLandscape } = info;
  const normalGutter = { left: GUTTER_PX, right: GUTTER_PX };
  if (!fullscreen) {
    return {};
  }
  if (!isLandscape) {
    // for Portrait Video
    if (!insets) {
      return { ...normalGutter, bottom: 32 }; // no external useSafeAreaInsets
    }
    if (insets && isZeroInsets(insets)) {
      return { ...normalGutter, bottom: 20 }; // iPhone8
    }
    return { ...normalGutter, bottom: 0 }; // iPhone11+
  }
  // for Landscape Video
  if (!insets) {
    return {
      left: `${GUTTER_PERCENT}%`,
      right: `${GUTTER_PERCENT}%`,
      bottom: 20,
    };
  }
  if (insets && isZeroInsets(insets)) {
    return { ...normalGutter, bottom: 20 }; // iPhone8
  }
  return { ...normalGutter, bottom: 20 }; // iPhone11+
};

export const getExitFullscreenOffset = (
  isLandscape: boolean,
  insets?: Inset,
) => {
  if (!isLandscape) {
    if (insets && !isZeroInsets(insets)) {
      return {
        bottom: 48,
        right: GUTTER_PX,
      };
    }
    return {
      bottom: 72,
      right: GUTTER_PX / 2,
    };
  }
  // for Landscape Video
  if (insets) {
    return {
      bottom: 56,
      right: GUTTER_PX / 2,
    };
  }
  return {
    bottom: 56,
    right: `${GUTTER_PERCENT}%`,
  };
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
