import { Dimensions, ViewStyle } from 'react-native';
import { OrientationValue } from './OrientationInterface';

type Data = {
  deviceWidth: number;
  deviceHeight: number;
  isPortraitLocked: boolean;
  isLandscapeDevice: boolean;
  insets: Partial<{ top: number; bottom: number; left: number; right: number }>;
};

export type LayoutData = {
  isPortraitLocked: boolean;
  isLandscapeDevice: boolean;
  isLandscapeVideo: boolean;
  insets?: Partial<{
    top: number;
    bottom: number;
    left: number;
    right: number;
  }>;
  deviceOrientation?: OrientationValue;
};

export const getCanvasContainSize = (data: Data) => {
  const {
    deviceWidth,
    deviceHeight,
    isPortraitLocked,
    isLandscapeDevice,
    insets,
  } = data;
  if (isPortraitLocked) {
    if (!isLandscapeDevice || !isLandscapeDevice) {
      return {
        width: deviceWidth,
        height: deviceHeight - (insets?.top ?? 0) - (insets?.bottom ?? 0),
      };
    }
    if (isLandscapeDevice) {
      return {
        width: deviceHeight - (insets?.top ?? 0) - (insets?.bottom ?? 0),
        height: deviceWidth,
      };
    }
  }
  if (!isPortraitLocked) {
    if (!isLandscapeDevice) {
      return {
        width: deviceWidth,
        height: deviceHeight - (insets?.top ?? 0) - (insets?.bottom ?? 0),
      };
    }
    if (isLandscapeDevice) {
      return {
        width: deviceHeight - (insets?.left ?? 0) - (insets?.right ?? 0),
        height: deviceWidth,
      };
    }
  }
  return { width: 0, height: 0 };
};

export const getCanvasAutoFitSize = (
  data: Data & { isLandscapeVideo: boolean },
) => {
  const {
    deviceWidth,
    deviceHeight,
    isPortraitLocked,
    isLandscapeDevice,
    isLandscapeVideo,
    insets,
  } = data;
  if (isPortraitLocked) {
    if (isLandscapeVideo) {
      return {
        width: deviceHeight - (insets?.top ?? 0) - (insets?.bottom ?? 0),
        height: deviceWidth,
      };
    } else {
      return {
        width: deviceWidth,
        height: deviceHeight - (insets?.top ?? 0) - (insets?.bottom ?? 0),
      };
    }
  }
  if (!isPortraitLocked) {
    if (!isLandscapeDevice && isLandscapeVideo) {
      return {
        width: deviceHeight - (insets?.top ?? 0) - (insets?.bottom ?? 0),
        height: deviceWidth,
      };
    }
    if (isLandscapeDevice && isLandscapeVideo) {
      return {
        width: deviceHeight - (insets?.left ?? 0) - (insets?.right ?? 0),
        height: deviceWidth,
      };
    }
    if (!isLandscapeDevice && !isLandscapeVideo) {
      return {
        width: deviceWidth,
        height: deviceHeight - (insets?.top ?? 0) - (insets?.bottom ?? 0),
      };
    }
    if (isLandscapeDevice && !isLandscapeVideo) {
      console.log('test');
      return {
        width: deviceWidth,
        height: deviceHeight - (insets?.left ?? 0) - (insets?.right ?? 0),
      };
    }
  }
  return { width: 0, height: 0 };
};

export const getCanvasContainRotation = (data: {
  isPortraitLocked: boolean;
  deviceOrientation?: OrientationValue;
}) => {
  const { deviceOrientation, isPortraitLocked } = data;
  if (isPortraitLocked) {
    if (deviceOrientation === 'LANDSCAPE-LEFT') {
      return 90;
    }
    if (deviceOrientation === 'LANDSCAPE-RIGHT') {
      return -90;
    }
  }
  return 0;
};

export const getCanvasAutoFitRotation = (data: {
  isPortraitLocked: boolean;
  isLandscapeDevice: boolean;
  isLandscapeVideo: boolean;
  deviceOrientation?: OrientationValue;
}) => {
  const {
    deviceOrientation,
    isPortraitLocked,
    isLandscapeVideo,
    isLandscapeDevice,
  } = data;
  if (isPortraitLocked) {
    if (isLandscapeVideo) {
      if (deviceOrientation === 'LANDSCAPE-RIGHT') {
        return -90;
      }
      return 90;
    }
  }
  if (!isPortraitLocked) {
    if (!isLandscapeDevice && isLandscapeVideo) {
      return 90;
    }
    if (isLandscapeDevice && !isLandscapeVideo) {
      return -90;
    }
  }
  return 0;
};

export const Device = (isPortraitLocked: boolean) => {
  const windowSize = Dimensions.get('window');
  return [
    !isPortraitLocked && windowSize.width > windowSize.height
      ? windowSize.height
      : windowSize.width,
    !isPortraitLocked && windowSize.width > windowSize.height
      ? windowSize.width
      : windowSize.height,
  ];
};

export const getAutoFitCanvasLayout = (data: LayoutData) => {
  const [deviceWidth, deviceHeight] = Device(data.isPortraitLocked);
  const { width, height } = getCanvasAutoFitSize({
    ...data,
    insets: data.insets ?? {},
    deviceWidth,
    deviceHeight,
  });
  return {
    position: 'absolute',
    zIndex: 1200,
    width,
    height,
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -width / 2 },
      { translateY: -height / 2 },
      { rotate: `${getCanvasAutoFitRotation(data)}deg` },
    ],
  } as ViewStyle;
};

export const getContainCanvasLayout = (data: LayoutData) => {
  const [deviceWidth, deviceHeight] = Device(data.isPortraitLocked);
  const { width, height } = getCanvasContainSize({
    ...data,
    insets: data.insets ?? {},
    deviceWidth,
    deviceHeight,
  });
  return {
    position: 'absolute',
    zIndex: 1200,
    width,
    height,
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -width / 2 },
      { translateY: -height / 2 },
      { rotate: `${getCanvasContainRotation(data)}deg` },
    ],
  } as ViewStyle;
};
