import DimensionManager from './DimensionManager';

describe('DimensionManager', () => {
  beforeEach(() => {
    DimensionManager.device = {
      width: 400,
      height: 800,
    };
    DimensionManager.isLockedToPortrait = false;
    DimensionManager.aspectRatio = 'landscape';
  });
  describe('Width & Height', () => {
    it('default portrait with NO locked', () => {
      expect(
        DimensionManager.getPlayerWidth({
          fullscreen: false,
          isLandscape: false,
        }),
      ).toEqual(400);
      expect(
        DimensionManager.getPlayerHeight({
          fullscreen: false,
          isLandscape: false,
        }),
      ).toEqual(400 * 0.5625);
    });
    it('fullscreen portrait with NO locked', () => {
      expect(
        DimensionManager.getPlayerWidth({
          fullscreen: true,
          isLandscape: false,
        }),
      ).toEqual(400);
      expect(
        DimensionManager.getPlayerHeight({
          fullscreen: false,
          isLandscape: true,
        }),
      ).toEqual(400 * 0.5625);
    });

    it('LOCKED fullscreen landscape with insets', () => {
      DimensionManager.isLockedToPortrait = true;
      expect(
        DimensionManager.getPlayerWidth({
          insets: { top: 48, bottom: 34 },
          fullscreen: true,
          isLandscape: true,
        }),
      ).toEqual(800 - 48 - 34);
      expect(
        DimensionManager.getPlayerHeight({
          insets: { top: 48, bottom: 34 },
          fullscreen: true,
          isLandscape: true,
        }),
      ).toEqual(400);
    });

    it('LOCKED fullscreen portrait with insets', () => {
      DimensionManager.isLockedToPortrait = true;
      expect(
        DimensionManager.getPlayerWidth({
          insets: { top: 48, bottom: 34 },
          fullscreen: true,
          isLandscape: false,
        }),
      ).toEqual(400);
      expect(
        DimensionManager.getPlayerHeight({
          insets: { top: 48, bottom: 34 },
          fullscreen: true,
          isLandscape: false,
        }),
      ).toEqual(800 - 48 - 34);
      expect(
        // iPhone 8
        DimensionManager.getPlayerHeight({
          insets: { top: 20, bottom: 0 },
          fullscreen: true,
          isLandscape: false,
        }),
      ).toEqual(800);
    });
  });

  describe('Seeker', () => {
    it('default any orientation', () => {
      expect(
        DimensionManager.getSeekerWidth({
          fullscreen: false,
          isLandscape: false,
        }),
      ).toEqual('100%');
    });

    it('fullscreen portrait', () => {
      expect(
        DimensionManager.getSeekerWidth({
          fullscreen: true,
          isLandscape: false,
          gutter: 16,
        }),
      ).toEqual(400 - 16 - 16);
    });

    it('fullscreen landscape', () => {
      expect(
        DimensionManager.getSeekerWidth({
          fullscreen: true,
          isLandscape: true,
          gutter: 5,
        }),
      ).toEqual('90%');
      expect(
        DimensionManager.getSeekerWidth({
          insets: { top: 48, bottom: 34 },
          fullscreen: true,
          isLandscape: true,
        }),
      ).toEqual('100%');
      expect(
        DimensionManager.getSeekerWidth({
          insets: { top: 0, bottom: 0, left: 0, right: 0 },
          fullscreen: true,
          isLandscape: true,
          gutter: 16,
        }),
      ).toEqual(800 - 16 - 16);
    });
  });
});
