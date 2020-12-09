import { getSecondsToSeek, toTimeView, getThumbPosition } from './utils';

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
    expect(getThumbPosition(100, 10, 316, 8)).toEqual(8 + 30)
  })
});
