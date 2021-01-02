import { useEffect, useState } from 'react';
import { FullscreenOrientation, VideoContext } from './ScreenContainer';
import { OrientationLocker } from './LayoutCalc';
import { Dimensions, ScaledSize } from 'react-native';

export type OrientationValue =
  | 'PORTRAIT'
  | 'LANDSCAPE-LEFT'
  | 'LANDSCAPE-RIGHT'
  | 'PORTRAIT-UPSIDEDOWN'
  | 'FACE-UP'
  | 'FACE-DOWN'
  | 'UNKNOWN';
interface Callback {
  (orientation: OrientationValue): void;
}
interface OrientationLib {
  lockToPortrait: () => void;
  getDeviceOrientation: (callback: Callback) => void;
  addDeviceOrientationListener: (callback: Callback) => void;
  removeDeviceOrientationListener: (callback: Callback) => void;
  unlockAllOrientations: () => void;
}

let OrientationAPI = {
  lockToPortrait: () => {},
  getDeviceOrientation: (callback: Callback) => {
    callback('UNKNOWN');
  },
  addDeviceOrientationListener: (callback: Callback) => {
    callback('UNKNOWN');
  },
  removeDeviceOrientationListener: (callback: Callback) => {
    callback('UNKNOWN');
  },
  unlockAllOrientations: () => {},
};

export function connectOrientationLib(ExternalOrientation: OrientationLib) {
  OrientationLocker.isPortraitLocked = true;
  OrientationAPI = ExternalOrientation;
}

const useOrientationEffect = ({
  fullscreen,
  setFullscreen,
  isLandscape,
}: {
  fullscreen: VideoContext['fullscreen'];
  setFullscreen: VideoContext['setFullscreen'];
  isLandscape: boolean;
}) => {
  let Orientation = OrientationAPI;
  useEffect(() => {
    Orientation.lockToPortrait();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, [Orientation]);
  useEffect(() => {
    function handleOrientation(orientation: OrientationValue) {
      if (OrientationLocker.isPortraitLocked) {
        if (fullscreen && orientation === 'PORTRAIT') {
          setFullscreen(false);
        }
        if (
          orientation === 'LANDSCAPE-LEFT' ||
          orientation === 'LANDSCAPE-RIGHT'
        ) {
          setFullscreen(orientation);
        } else {
          setFullscreen(false);
        }
      }
    }
    Orientation.addDeviceOrientationListener(handleOrientation);
    return () => {
      Orientation.removeDeviceOrientationListener(handleOrientation);
    };
  }, [Orientation, isLandscape, fullscreen, setFullscreen]);

  useEffect(() => {
    function handleOrientation({
      screen: { width, height },
    }: {
      screen: ScaledSize;
    }) {
      if (!OrientationLocker.isPortraitLocked) {
        setFullscreen(width > height ? 'LANDSCAPE-LEFT' : false);
      }
    }
    Dimensions.addEventListener('change', handleOrientation);

    return () => {
      Dimensions.removeEventListener('change', handleOrientation);
    };
  }, [setFullscreen]);
};

export const useDeviceOrientation = () => {
  let Orientation = OrientationAPI;
  const [
    deviceOrientation,
    setDeviceOrientation,
  ] = useState<FullscreenOrientation>('PORTRAIT');
  useEffect(() => {
    function handleOrientation(orientation: OrientationValue) {
      if (OrientationLocker.isPortraitLocked) {
        if (
          orientation === 'LANDSCAPE-LEFT' ||
          orientation === 'LANDSCAPE-RIGHT'
        ) {
          setDeviceOrientation(orientation);
        } else {
          setDeviceOrientation('PORTRAIT');
        }
      }
    }
    Orientation.addDeviceOrientationListener(handleOrientation);
    return () => {
      Orientation.removeDeviceOrientationListener(handleOrientation);
    };
  }, [Orientation]);

  useEffect(() => {
    function handleOrientation({
      screen: { width, height },
    }: {
      screen: ScaledSize;
    }) {
      if (!OrientationLocker.isPortraitLocked) {
        setDeviceOrientation(width > height ? 'LANDSCAPE-LEFT' : 'PORTRAIT');
      }
    }
    Dimensions.addEventListener('change', handleOrientation);

    return () => {
      Dimensions.removeEventListener('change', handleOrientation);
    };
  }, []);

  return deviceOrientation;
};

export default useOrientationEffect;
