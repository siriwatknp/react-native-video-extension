import {
  Device,
  Gap,
  OrientationLocker,
  getPlayerSize,
  getSeekerWidth,
} from './LayoutCalc';

describe('LayoutCalc', () => {
  beforeEach(() => {
    OrientationLocker.isPortraitLocked = false;
  });
  describe('getDevice', () => {
    it('isPortraitLocked', () => {
      OrientationLocker.isPortraitLocked = true;
      expect(Device({ width: 400, height: 900 })).toMatchObject({
        width: 400,
        height: 900,
      });
    });

    it('dynamic window size', () => {
      expect(Device({ width: 900, height: 400 })).toMatchObject({
        width: 400,
        height: 900,
      });
      expect(Device({ width: 400, height: 900 })).toMatchObject({
        width: 400,
        height: 900,
      });
    });
  });

  describe('Gap', () => {
    it('isPortraitLocked', () => {
      OrientationLocker.isPortraitLocked = true;
      expect(
        Gap({
          insets: { top: 48, bottom: 34, right: 0, left: 0 },
          fullscreen: true,
          isLandscape: true,
        }),
      ).toEqual({ left: 48, right: 34, top: 0, bottom: 0 });
      expect(
        Gap({
          insets: { top: 48, bottom: 34, right: 0, left: 0 },
          fullscreen: true,
          isLandscape: false,
        }),
      ).toEqual({ left: 0, right: 0, top: 48, bottom: 34 });
    });

    it('dynamic window size', () => {
      expect(
        Gap({
          insets: { top: 48, bottom: 34, right: 0, left: 0 },
          fullscreen: true,
          isLandscape: false,
        }),
      ).toEqual({ left: 0, right: 0, top: 48, bottom: 34 });
      expect(
        Gap({
          insets: { top: 0, bottom: 0, right: 34, left: 48 },
          fullscreen: true,
          isLandscape: false,
        }),
      ).toEqual({ top: 0, bottom: 0, right: 34, left: 48 });
    });
  });

  describe('getPlayerSize', () => {
    describe('Phone with no insets (ex. iPhone8)', () => {
      it('default portrait with NO locked', () => {
        expect(
          getPlayerSize(
            { width: 400, height: 800 },
            {
              fullscreen: false,
              isLandscape: false,
              aspectRatio: 'landscape',
            },
          ),
        ).toEqual({
          width: 400,
          height: (400 * 9) / 16,
          marginLeft: 0,
          marginTop: 0,
        });
      });

      it('fullscreen portrait with NO locked', () => {
        expect(
          getPlayerSize(
            { width: 400, height: 800 },
            {
              fullscreen: true,
              isLandscape: false,
              aspectRatio: 'landscape',
            },
          ),
        ).toEqual({
          width: 400,
          height: 800,
          marginLeft: 0,
          marginTop: 0,
        });
      });

      it('fullscreen landscape with NO locked', () => {
        expect(
          getPlayerSize(
            { width: 800, height: 400 },
            {
              fullscreen: true,
              isLandscape: true,
              aspectRatio: 'landscape',
            },
          ),
        ).toEqual({
          width: 800,
          height: 400,
          marginLeft: 0,
          marginTop: 0,
        });
      });
    });

    describe('Phone with insets (ex. >=iPhone11)', () => {
      it('fullscreen portrait', () => {
        expect(
          getPlayerSize(
            { width: 400, height: 800 },
            {
              insets: { top: 48, bottom: 34, left: 0, right: 0 },
              fullscreen: true,
              isLandscape: false,
              aspectRatio: 'landscape',
            },
          ),
        ).toEqual({
          width: 400,
          height: 800 - 48 - 34,
          marginLeft: 0,
          marginTop: 48,
        });
      });

      it('fullscreen landscape with no LOCKED', () => {
        expect(
          getPlayerSize(
            { width: 800, height: 400 },
            {
              insets: { top: 0, bottom: 0, left: 48, right: 34 },
              fullscreen: true,
              isLandscape: true,
              aspectRatio: 'landscape',
            },
          ),
        ).toEqual({
          width: 800 - 48 - 34,
          height: 400,
          marginLeft: 41,
          marginTop: 0,
        });
      });
    });
  });

  describe('getSeekerWidth', () => {
    it('default any orientation', () => {
      expect(
        getSeekerWidth(
          { width: 800, height: 400 },
          {
            fullscreen: false,
            isLandscape: false,
          },
        ),
      ).toEqual('100%');
    });

    it('fullscreen portrait', () => {
      expect(
        getSeekerWidth(
          { width: 400, height: 800 },
          {
            fullscreen: true,
            isLandscape: false,
          },
        ),
      ).toEqual(400 - 16 - 16);
    });

    it('fullscreen landscape', () => {
      expect(
        getSeekerWidth(
          { width: 800, height: 400 },
          {
            fullscreen: true,
            isLandscape: true,
          },
        ),
      ).toEqual('90%');
      expect(
        getSeekerWidth(
          { width: 800, height: 400 },
          {
            insets: { top: 48, bottom: 34, left: 0, right: 0 },
            fullscreen: true,
            isLandscape: true,
          },
        ),
      ).toEqual('100%');
      expect(
        getSeekerWidth(
          { width: 800, height: 400 },
          {
            insets: { top: 0, bottom: 0, left: 0, right: 0 },
            fullscreen: true,
            isLandscape: true,
          },
        ),
      ).toEqual(800 - 16 - 16);
    });
  });
});
