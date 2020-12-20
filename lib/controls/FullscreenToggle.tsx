import React from 'react';
import { SvgExitFullscreen, SvgFullscreen } from '../../src/icons';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useVideoCtx } from '../ScreenContainer';

export type FullscreenToggleProps = TouchableOpacityProps;

const FullscreenToggle = ({ style, ...props }: FullscreenToggleProps) => {
  const { fullscreen, enterFullscreen, exitFullscreen } = useVideoCtx();
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([{ padding: 8 }, style])}
      {...props}
      onPress={fullscreen ? exitFullscreen : enterFullscreen}
    >
      {fullscreen ? <SvgExitFullscreen /> : <SvgFullscreen />}
    </TouchableOpacity>
  );
};

export default FullscreenToggle;
