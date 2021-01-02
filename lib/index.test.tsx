import { isValidElementType } from 'react-is';
import {
  ScreenContainer,
  FacebookPlayer,
  YoutubePlayer,
  connectOrientationLib,
  connectUseInsets,
  FullscreenHidden,
  SvgPlayArrow,
  SvgPause,
  SvgFullscreen,
  SvgExitFullscreen,
  SvgReplay10,
  SvgRefresh,
  SvgForward10,
  SvgVolumeUp,
  SvgVolumeOff,
} from './index';

describe('index export', () => {
  it('necessary modules', () => {
    expect(isValidElementType(ScreenContainer)).toBeTruthy();
    expect(isValidElementType(FacebookPlayer)).toBeTruthy();
    expect(isValidElementType(YoutubePlayer)).toBeTruthy();
    expect(typeof connectOrientationLib).toEqual('function');
    expect(typeof connectUseInsets).toEqual('function');
    expect(isValidElementType(FullscreenHidden)).toBeTruthy();
    expect(isValidElementType(SvgPlayArrow)).toBeTruthy();
    expect(isValidElementType(SvgPause)).toBeTruthy();
    expect(isValidElementType(SvgFullscreen)).toBeTruthy();
    expect(isValidElementType(SvgExitFullscreen)).toBeTruthy();
    expect(isValidElementType(SvgReplay10)).toBeTruthy();
    expect(isValidElementType(SvgRefresh)).toBeTruthy();
    expect(isValidElementType(SvgForward10)).toBeTruthy();
    expect(isValidElementType(SvgVolumeUp)).toBeTruthy();
    expect(isValidElementType(SvgVolumeOff)).toBeTruthy();
  });
});
