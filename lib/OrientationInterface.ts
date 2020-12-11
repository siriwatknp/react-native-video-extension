import { useEffect } from 'react';
import { VideoContext } from './ScreenContainer';

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
  addDeviceOrientationListener: (callback: Callback) => void;
  removeDeviceOrientationListener: (callback: Callback) => void;
  unlockAllOrientations: () => void;
}

let OrientationAPI = {
  lockToPortrait: () => {},
  addDeviceOrientationListener: (callback: Callback) => {
    callback('UNKNOWN');
  },
  removeDeviceOrientationListener: (callback: Callback) => {
    callback('UNKNOWN');
  },
  unlockAllOrientations: () => {},
};

export function connectOrientationLib(ExternalOrientation: OrientationLib) {
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
  }, []);
  useEffect(() => {
    function handleOrientation(orientation: OrientationValue) {
      if (
        orientation === 'LANDSCAPE-LEFT' ||
        orientation === 'LANDSCAPE-RIGHT'
      ) {
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
      }
    }
    Orientation.addDeviceOrientationListener(handleOrientation);
    return () => {
      Orientation.removeDeviceOrientationListener(handleOrientation);
    };
  }, [Orientation, isLandscape, fullscreen]);
};

export default useOrientationEffect;
