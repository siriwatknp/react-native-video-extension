import React from 'react';
import { SvgExitFullscreen, SvgFullscreen } from '../icons';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useVideoCtx } from '../ScreenContainer';

export type FullscreenToggleProps = {
  fullscreenIcon?: React.ReactElement;
  exitFullscreenIcon?: React.ReactElement;
} & TouchableOpacityProps;

const FullscreenToggle = ({
  style,
  fullscreenIcon,
  exitFullscreenIcon,
  ...props
}: FullscreenToggleProps) => {
  const { fullscreen, enterFullscreen, exitFullscreen } = useVideoCtx();
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([{ padding: 8 }, style])}
      {...props}
      onPress={fullscreen ? exitFullscreen : enterFullscreen}
    >
      {fullscreen
        ? exitFullscreenIcon ?? <SvgExitFullscreen />
        : fullscreenIcon ?? <SvgFullscreen />}
    </TouchableOpacity>
  );
};

export default FullscreenToggle;
