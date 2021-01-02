import { ReactElement } from 'react';

export { default as SvgFullscreen } from './SvgFullscreen';
export { default as SvgExitFullscreen } from './SvgExitFullscreen';
export { default as SvgPlayArrow } from './SvgPlayArrow';
export { default as SvgPause } from './SvgPause';
export { default as SvgReplay10 } from './SvgReplay10';
export { default as SvgForward10 } from './SvgForward10';
export { default as SvgRefresh } from './SvgRefresh';
export { default as SvgVolumeOff } from './SvgVolumeOff';
export { default as SvgVolumeUp } from './SvgVolumeUp';

export type IconConfig = Partial<
  Record<
    | 'fullscreenIcon'
    | 'exitFullscreenIcon'
    | 'playIcon'
    | 'pauseIcon'
    | 'replayIcon'
    | 'forwardIcon'
    | 'refreshIcon'
    | 'volumeOffIcon'
    | 'volumeUpIcon',
    ReactElement
  >
>;
