import { useEffect, useState } from 'react';
import { FullscreenOrientation, VideoContext } from './ScreenContainer';
import { OrientationLocker } from './LayoutCalc';
import { useWindowDimensions } from 'react-native';

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
  const { width, height } = useWindowDimensions();
  const [
    fullscreenOrientation,
    setOrientation,
  ] = useState<FullscreenOrientation>('PORTRAIT');
  let Orientation = OrientationAPI;
  useEffect(() => {
    Orientation.lockToPortrait();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);
  useEffect(() => {
    function handleOrientation(orientation: OrientationValue) {
      if (
        orientation === 'LANDSCAPE-LEFT' ||
        orientation === 'LANDSCAPE-RIGHT'
      ) {
        setOrientation(orientation);
        setFullscreen(orientation);
      } else {
        if (
          (orientation === 'PORTRAIT' ||
            orientation === 'PORTRAIT-UPSIDEDOWN') &&
          fullscreen &&
          !isLandscape
        ) {
          // do nothing, keep showing portrait fullscreen
        } else if (orientation === 'FACE-UP' && fullscreen) {
          // do nothing, keep showing fullscreen
        } else if (orientation !== 'UNKNOWN') {
          setFullscreen(false);
        }
        setOrientation('PORTRAIT');
      }
    }
    Orientation.addDeviceOrientationListener(handleOrientation);
    return () => {
      Orientation.removeDeviceOrientationListener(handleOrientation);
    };
  }, [Orientation, isLandscape, fullscreen]);
  return !OrientationLocker.isPortraitLocked
    ? width > height
      ? 'LANDSCAPE-LEFT'
      : 'PORTRAIT'
    : fullscreenOrientation;
};

export default useOrientationEffect;
