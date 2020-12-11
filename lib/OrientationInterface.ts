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
    callback("UNKNOWN")
  },
  removeDeviceOrientationListener: (callback: Callback) => {
    callback("UNKNOWN")
  },
  unlockAllOrientations: () => {},
}

export function connectOrientationLib(ExternalOrientation: OrientationLib) {
  OrientationAPI = ExternalOrientation
}

const useOrientation = () => OrientationAPI

export default useOrientation;
