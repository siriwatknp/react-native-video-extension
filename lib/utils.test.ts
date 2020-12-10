import {
  getSecondsToSeek,
  toTimeView,
  getThumbPosition,
  getThumbTopOffset,
  getScaleX,
  getScaleY,
} from './utils';

describe('utils', () => {
  it('toTimeView', () => {
    expect(toTimeView(60 * 60 + 12.25)).toEqual('1:00:12');
    expect(toTimeView(60 * 60 * 10 + 60 * 4 + 59)).toEqual('10:04:59');
    expect(toTimeView(60 * 60 * 10 + 60 * 4)).toEqual('10:04:00');

    expect(toTimeView(60 * 5 + 40)).toEqual('5:40');
    expect(toTimeView(60 * 12)).toEqual('12:00');

    expect(toTimeView(55.2329839)).toEqual('0:55');
    expect(toTimeView(1.234)).toEqual('0:01');
  });

  it('getSecondsToSeek', () => {
    expect(getSecondsToSeek(60, 12, 1016, 100, 8)).toEqual(18);
  });

  it('getThumbPosition', () => {
    expect(getThumbPosition(100, 10, 316, 8)).toEqual(8 + 30);
  });

  it('getThumbTopOffset', () => {
    expect(getThumbTopOffset(2, 8)).toEqual(-7);
    expect(getThumbTopOffset(20, 8)).toEqual(2);
  });

  it('getScaleX', () => {
    expect(
      getScaleX(
        { width: 400, height: 800 },
        { fullscreen: true, isLandscape: true },
      ),
    ).toEqual(2);
    expect(
      getScaleX(
        { width: 400, height: 800 },
        { fullscreen: true, isLandscape: false },
      ),
    ).toEqual(1);
  });

  it('getScaleY', () => {
    expect(
      getScaleY(
        { width: 400, height: 800 },
        { height: 300, fullscreen: true, isLandscape: true },
      ),
    ).toEqual(400/300);
    expect(
      getScaleY(
        { width: 400, height: 800 },
        { height: 300, fullscreen: true, isLandscape: false },
      ),
    ).toEqual(800/300);
  })
});
