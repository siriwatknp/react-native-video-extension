type Data = {
  deviceWidth: number;
  deviceHeight: number;
  isPortraitLocked: boolean;
  isLandscapeDevice: boolean;
  insets: Partial<{ top: number; bottom: number; left: number; right: number }>;
};

export const getCanvasAutoFitSize = (data: Data) => {
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

export const getCanvasContainSize = (
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
      return {
        width: deviceWidth,
        height: deviceHeight - (insets?.left ?? 0) - (insets?.right ?? 0),
      };
    }
  }
  return { width: 0, height: 0 };
};

export const getCanvasAutoFitRotation = (data: {
  isPortraitLocked: boolean;
  deviceOrientation?: 'PORTRAIT' | 'LANDSCAPE-LEFT' | 'LANDSCAPE-RIGHT';
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

export const getCanvasContainRotation = (data: {
  isPortraitLocked: boolean;
  isLandscapeDevice: boolean;
  isLandscapeVideo: boolean;
  deviceOrientation?: 'PORTRAIT' | 'LANDSCAPE-LEFT' | 'LANDSCAPE-RIGHT';
}) => {
  const { deviceOrientation, isPortraitLocked, isLandscapeVideo, isLandscapeDevice } = data;
  if (isPortraitLocked) {
    if (isLandscapeVideo) {
      if (deviceOrientation === 'LANDSCAPE-RIGHT') {
        return -90
      }
      return 90
    }
  }
  if (!isPortraitLocked) {
    if (!isLandscapeDevice && isLandscapeVideo) {
      return 90
    }
    if (isLandscapeDevice && !isLandscapeVideo) {
      return -90
    }
  }
  return 0;
};

// export const getCanvasLayout = (data: Data) => {
//   const {width, height} = getCanvasAutoFitSize();
//   return {
//     width: width,
//     height: height,
//     top: '50%',
//     left: '50%',
//     transform: [
//       { translateX: -width / 2 },
//       { translateY: -height / 2 },
//       { rotate: 0 },
//     ],
//   };
// };
