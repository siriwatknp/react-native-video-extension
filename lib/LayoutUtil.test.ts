import { Dimensions } from 'react-native';
import {
  Device,
  getCanvasContainSize,
  getCanvasAutoFitSize,
  getCanvasContainRotation,
  getCanvasAutoFitRotation,
} from './LayoutUtil';

jest.mock('react-native/Libraries/Utilities/Dimensions')

describe('LayoutUtil', () => {
  const deviceWidth = 400;
  const deviceHeight = 800;
  const topNotch = 48;
  const bottomNotch = 34;
  const longSide = deviceHeight - topNotch - bottomNotch;
  const shortSide = deviceWidth;
  describe('Device', () => {
    it('PortraitLocked', () => {
      // @ts-ignore
      Dimensions.get.mockReturnValue({ width: 400, height: 800 });
      expect(Device(true)).toEqual([400, 800]);
    });

    it('No Orientation Locked', () => {
      // @ts-ignore
      Dimensions.get.mockReturnValue({ width: 400, height: 800 });
      expect(Device(false)).toEqual([400, 800, 'PORTRAIT']);

      // @ts-ignore
      Dimensions.get.mockReturnValue({ width: 800, height: 400 });
      expect(Device(false)).toEqual([400, 800, 'LANDSCAPE']);
    })
  });
  describe('Contain', () => {
    it('1.Contain: PortraitLocked / PortraitOrientation / LandscapeVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: true,
        isLandscapeDevice: false,
        isLandscapeVideo: true,
        insets: { top: topNotch, bottom: bottomNotch },
      };
      expect(getCanvasContainSize(data)).toEqual({
        width: shortSide,
        height: longSide,
      });
      expect(
        getCanvasContainRotation({ ...data, deviceOrientation: 'PORTRAIT' }),
      ).toEqual(0);
    });
    it('2.Contain: PortraitLocked / LandscapeOrientation / LandscapeVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: true,
        isLandscapeDevice: true,
        isLandscapeVideo: true,
        insets: { top: topNotch, bottom: bottomNotch },
      };
      expect(getCanvasContainSize(data)).toEqual({
        width: longSide,
        height: shortSide,
      });
      expect(
        getCanvasContainRotation({
          ...data,
          deviceOrientation: 'LANDSCAPE-LEFT',
        }),
      ).toEqual(90);
      expect(
        getCanvasContainRotation({
          ...data,
          deviceOrientation: 'LANDSCAPE-RIGHT',
        }),
      ).toEqual(-90);
    });
    it('3.Contain: PortraitLocked / PortraitOrientation / PortraitVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: true,
        isLandscapeDevice: false,
        insets: { top: topNotch, bottom: bottomNotch },
      };
      expect(getCanvasContainSize(data)).toEqual({
        width: shortSide,
        height: longSide,
      });
      expect(
        getCanvasContainRotation({ ...data, deviceOrientation: 'PORTRAIT' }),
      ).toEqual(0);
    });
    it('4.Contain: PortraitLocked / LandscapeOrientation / PortraitVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: true,
        isLandscapeDevice: true,
        insets: { top: topNotch, bottom: bottomNotch },
      };
      expect(getCanvasContainSize(data)).toEqual({
        width: longSide,
        height: shortSide,
      });
      expect(
        getCanvasContainRotation({
          ...data,
          deviceOrientation: 'LANDSCAPE-LEFT',
        }),
      ).toEqual(90);
      expect(
        getCanvasContainRotation({
          ...data,
          deviceOrientation: 'LANDSCAPE-RIGHT',
        }),
      ).toEqual(-90);
    });
    it('5.Contain: PortraitUnlocked / PortraitOrientation / LandscapeVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: false,
        isLandscapeDevice: false,
        insets: { top: topNotch, bottom: bottomNotch },
      };
      expect(getCanvasContainSize(data)).toEqual({
        width: shortSide,
        height: longSide,
      });
      expect(getCanvasContainRotation(data)).toEqual(0);
    });
    it('6.Contain: PortraitUnlocked / LandscapeOrientation / LandscapeVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: false,
        isLandscapeDevice: true,
        insets: { left: 48, right: 34 },
      };
      expect(getCanvasContainSize(data)).toEqual({
        width: longSide,
        height: shortSide,
      });
      expect(getCanvasContainRotation(data)).toEqual(0);
    });
    it('7.Contain: PortraitUnlocked / LandscapeOrientation / PortraitVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: false,
        isLandscapeDevice: false,
        isLandscapeVideo: false,
        insets: { top: topNotch, bottom: bottomNotch },
      };
      expect(getCanvasContainSize(data)).toEqual({
        width: shortSide,
        height: longSide,
      });
      expect(getCanvasContainRotation(data)).toEqual(0);
    });
    it('8.Contain: PortraitUnlocked / LandscapeOrientation / PortraitVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: false,
        isLandscapeDevice: true,
        insets: { left: 48, right: 34 },
      };
      expect(getCanvasContainSize(data)).toEqual({
        width: longSide,
        height: shortSide,
      });
      expect(getCanvasContainRotation(data)).toEqual(0);
    });
  });

  describe('AutoFit', () => {
    it('1.AutoFit: PortraitLocked / PortraitOrientation / LandscapeVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: true,
        isLandscapeDevice: false,
        isLandscapeVideo: true,
        insets: { top: topNotch, bottom: bottomNotch },
      };
      expect(getCanvasAutoFitSize(data)).toEqual({
        width: longSide,
        height: shortSide,
      });
      expect(
        getCanvasAutoFitRotation({ ...data, deviceOrientation: 'PORTRAIT' }),
      ).toEqual(90);
    });
    it('2.AutoFit: PortraitLocked / LandscapeOrientation / LandscapeVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: true,
        isLandscapeDevice: true,
        isLandscapeVideo: true,
        insets: { top: topNotch, bottom: bottomNotch },
      };
      expect(getCanvasAutoFitSize(data)).toEqual({
        width: longSide,
        height: shortSide,
      });
      expect(
        getCanvasAutoFitRotation({
          ...data,
          deviceOrientation: 'LANDSCAPE-LEFT',
        }),
      ).toEqual(90);
    });
    it('3.AutoFit: PortraitLocked / PortraitOrientation / PortraitVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: true,
        isLandscapeDevice: false,
        isLandscapeVideo: false,
        insets: { top: topNotch, bottom: bottomNotch },
      };
      expect(getCanvasAutoFitSize(data)).toEqual({
        width: shortSide,
        height: longSide,
      });
      expect(
        getCanvasAutoFitRotation({
          ...data,
          deviceOrientation: 'PORTRAIT',
        }),
      ).toEqual(0);
    });
    it('4.AutoFit: PortraitLocked / LandscapeOrientation / PortraitVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: true,
        isLandscapeDevice: true,
        isLandscapeVideo: false,
        insets: { top: topNotch, bottom: bottomNotch },
      };
      expect(getCanvasAutoFitSize(data)).toEqual({
        width: shortSide,
        height: longSide,
      });
      expect(getCanvasAutoFitRotation(data)).toEqual(0);
    });
    it('5.AutoFit: PortraitUnlocked / PortraitOrientation / LandscapeVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: false,
        isLandscapeDevice: false,
        isLandscapeVideo: true,
        insets: { top: topNotch, bottom: bottomNotch },
      };
      expect(getCanvasAutoFitSize(data)).toEqual({
        width: longSide,
        height: shortSide,
      });
      expect(getCanvasAutoFitRotation(data)).toEqual(90);
    });
    it('6.AutoFit: PortraitUnlocked / LandscapeOrientation / LandscapeVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: false,
        isLandscapeDevice: true,
        isLandscapeVideo: true,
        insets: { left: 48, right: 34 },
      };
      expect(getCanvasAutoFitSize(data)).toEqual({
        width: longSide,
        height: shortSide,
      });
      expect(getCanvasAutoFitRotation(data)).toEqual(0);
    });
    it('7.AutoFit: PortraitUnlocked / LandscapeOrientation / PortraitVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: false,
        isLandscapeDevice: false,
        isLandscapeVideo: false,
        insets: { top: topNotch, bottom: bottomNotch },
      };
      expect(getCanvasAutoFitSize(data)).toEqual({
        width: shortSide,
        height: longSide,
      });
      expect(getCanvasAutoFitRotation(data)).toEqual(0);
    });
    it('8.AutoFit: PortraitUnlocked / LandscapeOrientation / PortraitVideo', () => {
      const data = {
        deviceWidth,
        deviceHeight,
        isPortraitLocked: false,
        isLandscapeDevice: true,
        isLandscapeVideo: false,
        insets: { left: 48, right: 34 },
      };
      expect(getCanvasAutoFitSize(data)).toEqual({
        width: shortSide,
        height: longSide,
      });
      expect(getCanvasAutoFitRotation(data)).toEqual(-90);
    });
  });
});
